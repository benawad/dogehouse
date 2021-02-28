package types

import (
	"github.com/jiyeyuran/mediasoup-go"
)

type Room struct {
	Worker *mediasoup.Worker
	Router *mediasoup.Router
	Peers  map[string]Peer
}

type MediasoupWorker struct {
	Worker *mediasoup.Worker
	Router *mediasoup.Router
}

type Peer struct {
	SendTransport *mediasoup.Transport
	RecvTransport *mediasoup.Transport
	Producer      *mediasoup.Producer
	Consumers     []*mediasoup.Consumer
}

type ConsumerData struct {
	
}