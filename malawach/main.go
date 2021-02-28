package main

import (
	"errors"
	"github.com/jiyeyuran/mediasoup-go"
	"malawach/config"
	"malawach/rabbit"
	"malawach/types"
	"runtime"
)

type App struct {
	Rooms            map[string]types.Room
	MediaSoupWorkers []types.MediasoupWorker
	Config           config.Config
}

func (receiver App) GetNextWorker() func() types.MediasoupWorker {
	workerIndex := 0
	return func() types.MediasoupWorker {
		returnWorker := receiver.MediaSoupWorkers[workerIndex]
		workerIndex++
		workerIndex %= len(receiver.MediaSoupWorkers)
		return returnWorker
	}
}

func (receiver App) CreateRoom() func() types.Room {
	getWorker := receiver.GetNextWorker()
	return func() types.Room {
		worker := getWorker()
		return types.Room{
			Worker: worker.Worker,
			Router: worker.Router,
			Peers:  map[string]types.Peer{},
		}
	}
}

func (receiver App) initializeMediasoup() {
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
		receiver.MediaSoupWorkers = append(receiver.MediaSoupWorkers, types.MediasoupWorker{
			Worker: worker,
			Router: router,
		})
	}
}



func main() {
	app := App{
		Rooms:            map[string]types.Room{},
		MediaSoupWorkers: []types.MediasoupWorker{},
		Config:           config.CreateConfig(),
	}
	app.initializeMediasoup()
	rabbitConnection := rabbit.ConnectToRabbit()
	
	rabbitConnection.On(rabbit.RabbitOnRequest{
		EventName: "remove-speaker",
		Handler: func(message rabbit.RabbitMessage, send func(message rabbit.RabbitMessageBody), callError func()) {
			data := message.Data.(map[string]string)
			room, foundRoom := app.Rooms[data["roomId"]]
			if foundRoom {
				peer , foundPeer := room.Peers[data["peerId"]]
				if foundPeer {
					peer.Producer.Close()
					peer.SendTransport.Close()
				}
			}
		},
	})

	rabbitConnection.On(rabbit.RabbitOnRequest{
		EventName: "destroy-room",
		Handler: func(message rabbit.RabbitMessage, send func(message rabbit.RabbitMessageBody), callError func()) {
			data := message.Data.(map[string]string)
			room, foundRoom := app.Rooms[data["roomId"]]
			if foundRoom {
				for _, peer := range room.Peers {
					utils.ClosePeer(peer)
				}
				delete(app.Rooms, data["roomId"])
			}
		},
	})

	rabbitConnection.On(rabbit.RabbitOnRequest{
		EventName: "close-peer",
		Handler: func(message rabbit.RabbitMessage, send func(message rabbit.RabbitMessageBody), callError func()) {
			data := message.Data.(map[string]string)
			room, foundRoom := app.Rooms[data["roomId"]]
			if foundRoom {
				peer , foundPeer := room.Peers[data["peerId"]]
				if foundPeer {
					utils.ClosePeer(peer)
					delete(room.Peers, data["peerId"])
				}
				if len(room.Peers) == 0 {
					delete(app.Rooms, data["roomId"])
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
				peer , foundPeer := room.Peers[data["peerId"].(string)]
				if foundPeer {
					var result struct{
						ConsumerParametersArray struct{

						} `json:"consumerParametersArr"`
						RoomId string `json:"roomId"`
					}
					return
				}
			}
			callError()
		},
	})
}
