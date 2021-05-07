import { RtpParameters } from "mediasoup/lib/RtpParameters";
import { getCodecInfoFromRtpParameters } from "./getCodecInfoFromRtpParameters";

// File to create SDP text from mediasoup RTP Parameters
export const createSdpText = (port: number, rtpParameters: RtpParameters) => {
  // Audio codec info
  const audioCodecInfo = getCodecInfoFromRtpParameters(rtpParameters);

  return `v=0
  o=- 0 0 IN IP4 127.0.0.1
  s=FFmpeg
  c=IN IP4 127.0.0.1
  t=0 0
  m=audio ${port} RTP/AVP 120
  a=rtpmap:120 ${audioCodecInfo.codecName}/${audioCodecInfo.clockRate}/${audioCodecInfo.channels}
  a=sendonly
  `;
};

/*

v=0
  o=- 0 0 IN IP4 127.0.0.1
  s=FFmpeg
  c=IN IP4 127.0.0.1
  t=0 0
  m=audio 26912 RTP/AVP 120
  a=rtpmap:120 opus/48000/2
  a=sendonly

*/
