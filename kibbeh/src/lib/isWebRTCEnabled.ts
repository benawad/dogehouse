export const isWebRTCEnabled = () =>
  [
    "RTCPeerConnection",
    "webkitRTCPeerConnection",
    "mozRTCPeerConnection",
    "RTCIceGatherer",
  ].some((item) => window && item in window);
