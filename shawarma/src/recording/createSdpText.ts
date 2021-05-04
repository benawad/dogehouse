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
  m=audio ${port} RTP/AVP ${audioCodecInfo.payloadType}
  a=rtpmap:${audioCodecInfo.payloadType} ${audioCodecInfo.codecName}/${audioCodecInfo.clockRate}/${audioCodecInfo.channels}
  a=sendonly
  `;
};
