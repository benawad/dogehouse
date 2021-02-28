package config

import (
	"github.com/jiyeyuran/mediasoup-go"
	"os"
)

type Config struct {
	HttpIp        string
	HttpPort      uint16
	HttpPeerStale uint32
	Mediasoup     MediasoupConfig
}

type MediasoupConfig struct {
	Worker          MediasoupWorkerConfig
	Router          MediasoupRouterConfig
	WebRtcTransport MediasoupWebRtcTransportConfig
}
type MediasoupWorkerConfig struct {
	RtcMainPort uint16
	RtcMaxPort  uint16
	LogLevel    mediasoup.WorkerLogLevel
	LogTags     []mediasoup.WorkerLogTag
}

type MediasoupRouterConfig struct {
	MediaCodecs []*mediasoup.RtpCodecCapability
}

type MediasoupWebRtcTransportConfig struct {
	ListenIps                       []mediasoup.TransportListenIp
	InitialAvailableOutgoingBitrate uint32
}

func CreateConfig() Config {
	ip := os.Getenv("WEBRTC_LISTEN_IP")
	announcedIp := os.Getenv("A_IP")
	if ip == "" {
		ip = "127.0.0.1"
	}
	return Config{
		HttpIp:        "0.0.0.0",
		HttpPort:      3000,
		HttpPeerStale: 360000,
		Mediasoup: MediasoupConfig{
			Worker: MediasoupWorkerConfig{
				RtcMainPort: 40000,
				RtcMaxPort:  49999,
				LogLevel:    "debug",
				LogTags: []mediasoup.WorkerLogTag{
					"info",
					"ice",
					"dtls",
					"rtp",
					"srtp",
					"rtcp",
				},
			},
			Router: MediasoupRouterConfig{
				MediaCodecs: []*mediasoup.RtpCodecCapability{
					{
						Kind:      "audio",
						MimeType:  "audio/opus",
						ClockRate: 48000,
						Channels:  2,
					},
				},
			},
			WebRtcTransport: MediasoupWebRtcTransportConfig{
				ListenIps: []mediasoup.TransportListenIp{
					{
						Ip:          ip,
						AnnouncedIp: announcedIp,
					},
				},
				InitialAvailableOutgoingBitrate: 800000,
			},
		},
	}
}
