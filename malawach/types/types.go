package types

import (
	"github.com/jiyeyuran/mediasoup-go"
)

type Room struct {
	Worker *mediasoup.Worker
	Router *mediasoup.Router
	Peers  map[string]*Peer
}

type MediasoupWorker struct {
	Worker *mediasoup.Worker
	Router *mediasoup.Router
}

type Peer struct {
	SendTransport *mediasoup.WebRtcTransport
	RecvTransport *mediasoup.WebRtcTransport
	Producer      *mediasoup.Producer
	Consumers     []*mediasoup.Consumer
}

type ConsumerAppData struct {
	PeerId string `json:"peerId"`
	MediaPeerId string `json:"mediaPeerId"`
	TransportId string `json:"transportId"`
}

type ConsumerData struct {
	PeerId string `json:"peerId"`
	ConsumerParameters ConsumerParameters `json:"consumerParameters"`
}

type ConsumerParameters struct {
	ProducerId string `json:"producerId"`
	Id string `json:"id"`
	Kind mediasoup.MediaKind `json:"kind"`
	RtpParameters mediasoup.RtpParameters `json:"rtpParameters"`
	Type mediasoup.ConsumerType `json:"type"`
	ProducerPaused bool `json:"producerPaused"`
}

type WebTrcTransportData struct {
	PeerId string `json:"peerId"`
	ClientDirection string `json:"clientDirection"`
}

type TransportOptions struct {
	Id string `json:"id"`
	IceParameters mediasoup.IceParameters `json:"iceParameters"`
	IceCandidates []mediasoup.IceCandidate `json:"iceCandidates"`
	DtlsParameters mediasoup.DtlsParameters `json:"dtlsParameters"`
}
