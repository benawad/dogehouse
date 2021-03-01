package utils

import (
	"encoding/json"
	"errors"
	"github.com/jiyeyuran/mediasoup-go"
	"malawach/config"
	"malawach/types"
)

func ClosePeer(peer *types.Peer) {
	if peer.Producer != nil {
		_ = peer.Producer.Close()
	}
	if peer.RecvTransport != nil {
		peer.RecvTransport.Close()
	}
	if peer.SendTransport != nil {
		peer.SendTransport.Close()
	}
	for _, consumer := range peer.Consumers {
		_ = consumer.Close()
	}
}

func CreateConsumer(
	router *mediasoup.Router,
	producer *mediasoup.Producer,
	rtpCapabilities mediasoup.RtpCapabilities,
	recvTransport *mediasoup.WebRtcTransport,
	peerId string,
	targetPeer *types.Peer,
) (types.ConsumerData, error) {
	if !router.CanConsume(producer.Id(), rtpCapabilities) {
		return types.ConsumerData{}, errors.New("recv-track: client cannot consume " + producer.Id())
	}
	consumer, createConsumerError := recvTransport.Consume(mediasoup.ConsumerOptions{
		ProducerId:      producer.Id(),
		RtpCapabilities: rtpCapabilities,
		Paused:          false,
		AppData: types.ConsumerAppData{
			PeerId:      peerId,
			MediaPeerId: producer.AppData().(types.ConsumerAppData).PeerId,
		},
	})
	if createConsumerError != nil {
		return types.ConsumerData{}, createConsumerError
	}

	targetPeer.Consumers = append(targetPeer.Consumers, consumer)

	return types.ConsumerData{
		PeerId: producer.AppData().(types.ConsumerAppData).PeerId,
		ConsumerParameters: types.ConsumerParameters{
			ProducerId:     producer.Id(),
			Id:             consumer.Id(),
			Kind:           consumer.Kind(),
			RtpParameters:  consumer.RtpParameters(),
			Type:           consumer.Type(),
			ProducerPaused: consumer.ProducerPaused(),
		},
	}, nil
}

func CreateTransport(direction string, router *mediasoup.Router, peerId string, appConfig config.Config) (transport *mediasoup.WebRtcTransport, err error) {
	truePtr := true
	return router.CreateWebRtcTransport(mediasoup.WebRtcTransportOptions{
		ListenIps:                       appConfig.Mediasoup.WebRtcTransport.ListenIps,
		EnableUdp:                       &truePtr,
		EnableTcp:                       true,
		PreferUdp:                       true,
		PreferTcp:                       false,
		InitialAvailableOutgoingBitrate: appConfig.Mediasoup.WebRtcTransport.InitialAvailableOutgoingBitrate,
		AppData: types.WebTrcTransportData{
			PeerId:          peerId,
			ClientDirection: direction,
		},
	})
}

func TransportToOptions(transport *mediasoup.WebRtcTransport) types.TransportOptions {
	return types.TransportOptions{
		Id:             transport.Id(),
		IceParameters:  transport.IceParameters(),
		IceCandidates:  transport.IceCandidates(),
		DtlsParameters: transport.DtlsParameters(),
	}
}

func ParseMapToDtlsParameters(source map[string]interface{}) (mediasoup.DtlsParameters, error) {
	stringify, stringifyErr := json.Marshal(source)
	if stringifyErr != nil {
		return mediasoup.DtlsParameters{}, stringifyErr
	}
	var target mediasoup.DtlsParameters
	parseErr := json.Unmarshal(stringify, &target)
	if parseErr != nil {
		return mediasoup.DtlsParameters{}, parseErr
	}
	return target, nil
}

func ParseMapToRtpCapabilities(source map[string]interface{}) (mediasoup.RtpCapabilities, error) {
	stringify, stringifyErr := json.Marshal(source)
	if stringifyErr != nil {
		return mediasoup.RtpCapabilities{}, stringifyErr
	}
	var target mediasoup.RtpCapabilities
	parseErr := json.Unmarshal(stringify, &target)
	if parseErr != nil {
		return mediasoup.RtpCapabilities{}, parseErr
	}
	return target, nil
}

func ParseMapToRtpParameters(source map[string]interface{}) (mediasoup.RtpParameters, error) {
	stringify, stringifyErr := json.Marshal(source)
	if stringifyErr != nil {
		return mediasoup.RtpParameters{}, stringifyErr
	}
	var target mediasoup.RtpParameters
	parseErr := json.Unmarshal(stringify, &target)
	if parseErr != nil {
		return mediasoup.RtpParameters{}, parseErr
	}
	return target, nil
}

func ParseMapToConsumerAppData(source map[string]interface{}) (types.ConsumerAppData, error) {
	stringify, stringifyErr := json.Marshal(source)
	if stringifyErr != nil {
		return types.ConsumerAppData{}, stringifyErr
	}
	var target types.ConsumerAppData
	parseErr := json.Unmarshal(stringify, &target)
	if parseErr != nil {
		return types.ConsumerAppData{}, parseErr
	}
	return target, nil
}
