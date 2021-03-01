package main

import (
	"errors"
	"fmt"
	"github.com/jiyeyuran/mediasoup-go"
	"malawach/config"
	"malawach/rabbit"
	"malawach/types"
	"malawach/utils"
	"runtime"
)

type App struct {
	Rooms            map[string]*types.Room
	MediaSoupWorkers []*types.MediasoupWorker
	Config           config.Config
}

func (receiver *App) WorkerGenerator() func() *types.MediasoupWorker {
	workerIndex := 0
	return func() *types.MediasoupWorker {
		returnWorker := receiver.MediaSoupWorkers[workerIndex]
		workerIndex++
		workerIndex %= len(receiver.MediaSoupWorkers)
		return returnWorker
	}
}

func (receiver *App) RoomGenerator() func() *types.Room {
	getWorker := receiver.WorkerGenerator()
	return func() *types.Room {
		worker := getWorker()
		return &types.Room{
			Worker: worker.Worker,
			Router: worker.Router,
			Peers:  make(map[string]*types.Peer, 0),
		}
	}
}

func (receiver *App) initializeMediasoup() {
	i := 0
	for i < runtime.NumCPU() {
		i++
		worker, createWorkerErr := mediasoup.NewWorker(func(w *mediasoup.WorkerSettings) {
			w.LogTags = receiver.Config.Mediasoup.Worker.LogTags
			w.LogLevel = receiver.Config.Mediasoup.Worker.LogLevel
			w.RtcMaxPort = receiver.Config.Mediasoup.Worker.RtcMaxPort
			w.RtcMinPort = receiver.Config.Mediasoup.Worker.RtcMainPort
		})
		if createWorkerErr != nil {
			panic(createWorkerErr)
		}
		worker.On("died", func() {
			panic(errors.New("mediasoup worker died (this should never happen)"))
		})
		router, createRouterErr := worker.CreateRouter(mediasoup.RouterOptions{
			MediaCodecs: receiver.Config.Mediasoup.Router.MediaCodecs,
		})
		if createRouterErr != nil {
			panic(createRouterErr)
		}
		receiver.MediaSoupWorkers = append(receiver.MediaSoupWorkers, &types.MediasoupWorker{
			Worker: worker,
			Router: router,
		})
	}
}

func main() {
	app := App{
		Rooms:            make(map[string]*types.Room, 0),
		MediaSoupWorkers: []*types.MediasoupWorker{},
		Config:           config.CreateConfig(),
	}
	app.initializeMediasoup()
	rabbitConnection := rabbit.ConnectToRabbit()

	createRoom := app.RoomGenerator()

	rabbitConnection.On(rabbit.RabbitOnRequest{
		EventName: "remove-speaker",
		Handler: func(message rabbit.RabbitMessage, send func(message rabbit.RabbitMessageBody), callError func()) {
			data := message.Data.(map[string]interface{})
			room, foundRoom := app.Rooms[data["roomId"].(string)]
			if foundRoom {
				peer, foundPeer := room.Peers[data["peerId"].(string)]
				if foundPeer {
					_ = peer.Producer.Close()
					peer.SendTransport.Close()
				}
			}
		},
	})

	rabbitConnection.On(rabbit.RabbitOnRequest{
		EventName: "destroy-room",
		Handler: func(message rabbit.RabbitMessage, send func(message rabbit.RabbitMessageBody), callError func()) {
			data := message.Data.(map[string]interface{})
			room, foundRoom := app.Rooms[data["roomId"].(string)]
			if foundRoom {
				for _, peer := range room.Peers {
					utils.ClosePeer(peer)
				}
				delete(app.Rooms, data["roomId"].(string))
			}
		},
	})

	rabbitConnection.On(rabbit.RabbitOnRequest{
		EventName: "close-peer",
		Handler: func(message rabbit.RabbitMessage, send func(message rabbit.RabbitMessageBody), callError func()) {
			data := message.Data.(map[string]interface{})
			room, foundRoom := app.Rooms[data["roomId"].(string)]
			if foundRoom {
				peer, foundPeer := room.Peers[data["peerId"].(string)]
				if foundPeer {
					utils.ClosePeer(peer)
					delete(room.Peers, data["peerId"].(string))
				}
				if len(room.Peers) == 0 {
					delete(app.Rooms, data["roomId"].(string))
				}
			}
		},
	})

	rabbitConnection.On(rabbit.RabbitOnRequest{
		EventName: "@get-recv-tracks",
		Handler: func(message rabbit.RabbitMessage, send func(message rabbit.RabbitMessageBody), callError func()) {
			data := message.Data.(map[string]interface{})
			room, foundRoom := app.Rooms[data["roomId"].(string)]
			if foundRoom {
				peer, foundPeer := room.Peers[data["peerId"].(string)]
				if foundPeer {
					result := struct {
						ConsumerParametersArray []types.ConsumerData `json:"consumerParametersArr"`
						RoomId                  string               `json:"roomId"`
					}{
						ConsumerParametersArray: make([]types.ConsumerData, 0),
						RoomId:                  data["roomId"].(string),
					}

					for currentPeerId, currentPeer := range room.Peers {
						if currentPeerId == data["peerId"].(string) || currentPeer.Producer == nil {
							continue
						}
						rtpCapabilities, rtpCapabilitiesParseErr := utils.ParseMapToRtpCapabilities(data["rtpCapabilities"].(map[string]interface{}))
						if rtpCapabilitiesParseErr != nil {
							_ = fmt.Errorf(rtpCapabilitiesParseErr.Error())
							continue
						}
						consumerData, createConsumerErr := utils.CreateConsumer(
							room.Router,
							currentPeer.Producer,
							rtpCapabilities,
							peer.RecvTransport,
							data["peerId"].(string),
							currentPeer,
						)
						if createConsumerErr != nil {
							_ = fmt.Errorf(createConsumerErr.Error())
							continue
						}

						result.ConsumerParametersArray = append(result.ConsumerParametersArray, consumerData)
					}

					send(rabbit.RabbitMessageBody{
						Operation: "@get-recv-tracks-done",
						Platform:  "web",
						Data:      result,
						Uid:       message.Uid,
					})
					return
				}
			}
			callError()
		},
	})

	rabbitConnection.On(rabbit.RabbitOnRequest{
		EventName: "@send-track",
		Handler: func(message rabbit.RabbitMessage, send func(message rabbit.RabbitMessageBody), callError func()) {
			data := message.Data.(map[string]interface{})
			roomId := data["roomId"].(string)
			peerId := data["peerId"].(string)
			direction := data["direction"].(string)
			transportId := data["transportId"].(string)
			var kind mediasoup.MediaKind
			if data["kind"].(string) == "audio" {
				kind = mediasoup.MediaKind_Audio
			} else {
				kind = mediasoup.MediaKind_Video
			}
			rtpParameters, rtpParametersParseErr := utils.ParseMapToRtpParameters(data["rtpParameters"].(map[string]interface{}))
			if rtpParametersParseErr != nil {
				callError()
				return
			}
			rtpCapabilities, rtpCapabilitiesParseErr := utils.ParseMapToRtpCapabilities(data["rtpCapabilities"].(map[string]interface{}))
			if rtpCapabilitiesParseErr != nil {
				callError()
				return
			}
			paused := data["paused"].(bool)
			appData, appDataParseErr := utils.ParseMapToConsumerAppData(data["appData"].(map[string]interface{}))
			if appDataParseErr != nil {
				callError()
				return
			}
			room, foundRoom := app.Rooms[roomId]
			if foundRoom {
				peer, foundPeer := room.Peers[peerId]
				if foundPeer {
					sendErr := func(err error) {
						send(rabbit.RabbitMessageBody{
							Operation: "@send-track-" + direction + "-done",
							Platform:  "web",
							Data: struct {
								Error  string `json:"error"`
								RoomId string `json:"roomId"`
							}{
								Error:  err.Error(),
								RoomId: roomId,
							},
							Uid: message.Uid,
						})
					}
					if peer.SendTransport == nil {
						callError()
						return
					}
					if peer.Producer != nil {
						closeErr := peer.Producer.Close()
						if closeErr != nil {
							sendErr(closeErr)
							return
						}
						for _, consumer := range peer.Consumers {
							closeErr := consumer.Close()
							if closeErr != nil {
								sendErr(closeErr)
								return
							}
						}
						send(rabbit.RabbitMessageBody{
							Operation: "close_consumer",
							Platform:  "web",
							Data: struct {
								ProducerId string `json:"producerId"`
								RoomID     string `json:"roomId"`
							}{
								ProducerId: peer.Producer.Id(),
								RoomID:     roomId,
							},
							RoomId: roomId,
						})
					}
					appData.PeerId = peerId
					appData.TransportId = transportId
					newProducer, createProducerErr := peer.SendTransport.Produce(mediasoup.ProducerOptions{
						Kind:          kind,
						RtpParameters: rtpParameters,
						Paused:        paused,
						AppData:       appData,
					})
					peer.Producer = newProducer
					if createProducerErr != nil {
						sendErr(createProducerErr)
						return
					}

					for currentPeerId, currentPeer := range room.Peers {
						if currentPeerId == peerId {
							continue
						}
						newConsumer, createConsumerError := utils.CreateConsumer(room.Router, newProducer, rtpCapabilities, peer.RecvTransport, peerId, currentPeer)
						if createConsumerError != nil {
							_ = fmt.Errorf(createConsumerError.Error())
						}
						send(rabbit.RabbitMessageBody{
							Operation: "new-peer-speaker",
							Platform:  "web",
							Data: struct {
								types.ConsumerData
								RoomId string `json:"roomId"`
							}{
								ConsumerData: newConsumer,
								RoomId:       roomId,
							},
							Uid: currentPeerId,
						})
					}
					send(rabbit.RabbitMessageBody{
						Operation: "@send-track-" + direction + "-done",
						Platform:  "web",
						Data: struct {
							Id     string `json:"id"`
							RoomId string `json:"roomId"`
						}{
							Id:     newProducer.Id(),
							RoomId: roomId,
						},
						Uid: message.Uid,
					})
				}
			}
		},
	})

	rabbitConnection.On(rabbit.RabbitOnRequest{
		EventName: "@connect-transport",
		Handler: func(message rabbit.RabbitMessage, send func(message rabbit.RabbitMessageBody), callError func()) {
			data := message.Data.(map[string]interface{})
			roomId := data["roomId"].(string)
			peerId := data["peerId"].(string)
			direction := data["direction"].(string)
			dtlsParameters, getDtlsParamsErr := utils.ParseMapToDtlsParameters(data["dtlsParameters"].(map[string]interface{}))

			if getDtlsParamsErr != nil {
				_ = fmt.Errorf(getDtlsParamsErr.Error())
				callError()
			}

			room, foundRoom := app.Rooms[roomId]
			if foundRoom {
				peer, foundPeer := room.Peers[peerId]
				if foundPeer {
					transport := peer.RecvTransport
					if direction != "recv" {
						transport = peer.SendTransport
					}
					if transport == nil {
						callError()
						return
					}

					connectErr := transport.Connect(mediasoup.TransportConnectOptions{
						DtlsParameters: &dtlsParameters,
					})
					if connectErr != nil {
						send(rabbit.RabbitMessageBody{
							Operation: "@connect-transport-" + direction + "-done",
							Platform:  "web",
							Data: struct {
								Error  string `json:"error"`
								RoomId string `json:"roomId"`
							}{
								Error:  connectErr.Error(),
								RoomId: roomId,
							},
							Uid: message.Uid,
						})
						send(rabbit.RabbitMessageBody{
							Operation: "error",
							Platform:  "vscode",
							Data:      "error connecting to voice server | " + connectErr.Error(),
							Uid:       message.Uid,
						})

					} else {
						send(rabbit.RabbitMessageBody{
							Operation: "@connect-transport-" + direction + "-done",
							Platform:  "wb",
							Data: struct {
								RoomId string `json:"roomId"`
							}{
								RoomId: roomId,
							},
							Uid: message.Uid,
						})
					}

				}
				return
			}
			callError()
			return
		},
	})

	rabbitConnection.On(rabbit.RabbitOnRequest{
		EventName: "create-room",
		Handler: func(message rabbit.RabbitMessage, send func(message rabbit.RabbitMessageBody), callError func()) {
			data := message.Data.(map[string]interface{})
			roomId := data["roomId"].(string)
			_, foundRoom := app.Rooms[data["roomId"].(string)]
			if !foundRoom {
				app.Rooms[roomId] = createRoom()
			}
			send(rabbit.RabbitMessageBody{
				Operation: "room-created",
				Platform:  "vscode",
				Data: struct {
					RoomId string `json:"roomId"`
				}{
					RoomId: roomId,
				},
				Uid: message.Uid,
			})
			return
		},
	})

	rabbitConnection.On(rabbit.RabbitOnRequest{
		EventName: "add-speaker",
		Handler: func(message rabbit.RabbitMessage, send func(message rabbit.RabbitMessageBody), callError func()) {
			data := message.Data.(map[string]interface{})
			roomId := data["roomId"].(string)
			peerId := data["peerId"].(string)

			room, foundRoom := app.Rooms[roomId]
			if foundRoom {
				peer, foundPeer := room.Peers[peerId]
				if foundPeer {
					newSendTransport, createTransportError := utils.CreateTransport("send", room.Router, peerId, app.Config)
					if createTransportError != nil {
						callError()
					}

					if peer.SendTransport != nil {
						peer.SendTransport.Close()
					}
					peer.SendTransport = newSendTransport

					send(rabbit.RabbitMessageBody{
						Operation: "you-are-now-a-speaker",
						Platform:  "web",
						Data: struct {
							SendTransportOptions types.TransportOptions `json:"sendTransportOptions"`
							RoomId               string                 `json:"roomId"`
						}{
							SendTransportOptions: utils.TransportToOptions(newSendTransport),
							RoomId:               roomId,
						},
						Uid: message.Uid,
					})
					return
				}
			}
			callError()
			return
		},
	})

	rabbitConnection.On(rabbit.RabbitOnRequest{
		EventName: "join-as-speaker",
		Handler: func(message rabbit.RabbitMessage, send func(message rabbit.RabbitMessageBody), callError func()) {
			data := message.Data.(map[string]interface{})
			roomId := data["roomId"].(string)
			peerId := data["peerId"].(string)

			room, foundRoom := app.Rooms[roomId]
			if !foundRoom {
				room = createRoom()
				app.Rooms[roomId] = room
			}
			peer, foundPeer := room.Peers[peerId]
			recvTransport, createRecvTransportError := utils.CreateTransport("recv", room.Router, peerId, app.Config)
			sendTransport, createSendTransportError := utils.CreateTransport("send", room.Router, peerId, app.Config)
			if createRecvTransportError != nil || createSendTransportError != nil {
				if createRecvTransportError != nil {
					_ = fmt.Errorf(createRecvTransportError.Error())
				}
				if createSendTransportError != nil {
					_ = fmt.Errorf(createSendTransportError.Error())
				}
				callError()
				return
			}
			if foundPeer {
				utils.ClosePeer(peer)
			}
			room.Peers[peerId] = &types.Peer{
				SendTransport: sendTransport,
				RecvTransport: recvTransport,
				Producer:      nil,
				Consumers:     []*mediasoup.Consumer{},
			}
			peer = room.Peers[peerId]
			send(rabbit.RabbitMessageBody{
				Operation: "you-joined-as-speaker",
				Platform:  "web",
				Data: struct {
					RoomId                string                    `json:"roomId"`
					PeerId                string                    `json:"peerId"`
					RouterRtpCapabilities mediasoup.RtpCapabilities `json:"routerRtpCapabilities"`
					RecvTransportOptions  types.TransportOptions    `json:"recvTransportOptions"`
					SendTransportOptions  types.TransportOptions    `json:"sendTransportOptions"`
				}{
					RoomId:                roomId,
					PeerId:                peerId,
					RouterRtpCapabilities: room.Router.RtpCapabilities(),
					RecvTransportOptions:  utils.TransportToOptions(recvTransport),
					SendTransportOptions:  utils.TransportToOptions(sendTransport),
				},
				Uid: message.Uid,
			})

		},
	})

	rabbitConnection.On(rabbit.RabbitOnRequest{
		EventName: "join-as-new-peer",
		Handler: func(message rabbit.RabbitMessage, send func(message rabbit.RabbitMessageBody), callError func()) {
			data := message.Data.(map[string]interface{})
			roomId := data["roomId"].(string)
			peerId := data["peerId"].(string)

			room, foundRoom := app.Rooms[roomId]
			if !foundRoom {
				room = createRoom()
				app.Rooms[roomId] = room
			}
			peer, foundPeer := room.Peers[peerId]
			recvTransport, createRecvTransportError := utils.CreateTransport("recv", room.Router, peerId, app.Config)
			if createRecvTransportError != nil {
				_ = fmt.Errorf(createRecvTransportError.Error())
				callError()
				return
			}

			if foundPeer {
				utils.ClosePeer(peer)
			}
			room.Peers[peerId] = &types.Peer{
				SendTransport: nil,
				RecvTransport: recvTransport,
				Producer:      nil,
				Consumers:     []*mediasoup.Consumer{},
			}
			peer = room.Peers[peerId]
			send(rabbit.RabbitMessageBody{
				Operation: "you-joined-as-peer",
				Platform:  "web",
				Data: struct {
					RoomId                string                    `json:"roomId"`
					PeerId                string                    `json:"peerId"`
					RouterRtpCapabilities mediasoup.RtpCapabilities `json:"routerRtpCapabilities"`
					RecvTransportOptions  types.TransportOptions    `json:"recvTransportOptions"`
				}{
					RoomId:                roomId,
					PeerId:                peerId,
					RouterRtpCapabilities: room.Router.RtpCapabilities(),
					RecvTransportOptions:  utils.TransportToOptions(recvTransport),
				},
				Uid: message.Uid,
			})

		},
	})

	select {} // sleep forever
}
