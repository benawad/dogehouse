import { RtpParameters } from "mediasoup/lib/RtpParameters";

// Gets codec information from rtpParameters
export const getCodecInfoFromRtpParameters = (rtpParameters: RtpParameters) => {
  return {
    payloadType: rtpParameters.codecs[0].payloadType,
    codecName: rtpParameters.codecs[0].mimeType.replace(`audio/`, ""),
    clockRate: rtpParameters.codecs[0].clockRate,
    channels: rtpParameters.codecs[0].channels,
  };
};
