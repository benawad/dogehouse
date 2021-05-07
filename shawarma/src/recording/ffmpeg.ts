import child_process, { ChildProcessWithoutNullStreams } from "child_process";
import { EventEmitter } from "events";
import { RtpParameters } from "mediasoup/lib/RtpParameters";
import path from "path";
import { convertStringToStream } from "./convertStringToStream";
import { createSdpText } from "./createSdpText";

export class FFmpeg {
  _rtpParameters: RtpParameters;
  _process: ChildProcessWithoutNullStreams | undefined = undefined;
  _observer: EventEmitter;
  _port: number;

  constructor(port: number, rtpParameters: RtpParameters) {
    this._port = port;
    this._rtpParameters = rtpParameters;
    this._process = undefined;
    this._observer = new EventEmitter();
    this._createProcess();
  }

  _createProcess() {
    const sdpString = createSdpText(this._port, this._rtpParameters);
    const sdpStream = convertStringToStream(sdpString);

    console.log("createProcess() [sdpString:%s]", sdpString);

    this._process = child_process.spawn("ffmpeg", this._commandArgs);

    if (this._process.stderr) {
      this._process.stderr.setEncoding("utf-8");

      this._process.stderr.on("data", (data) =>
        console.log("ffmpeg::process::data [data:%o]", data)
      );
    }

    if (this._process.stdout) {
      this._process.stdout.setEncoding("utf-8");

      this._process.stdout.on("data", (data) =>
        console.log("ffmpeg::process::data [data:%o]", data)
      );
    }

    this._process.on("message", (message) =>
      console.log("ffmpeg::process::message [message:%o]", message)
    );

    this._process.on("error", (error) =>
      console.error("ffmpeg::process::error [error:%o]", error)
    );

    this._process.once("close", () => {
      console.log("ffmpeg::process::close");
      this._observer.emit("process-close");
    });

    sdpStream.on("error", (error) =>
      console.error("sdpStream::error [error:%o]", error)
    );

    // Pipe sdp stream to the ffmpeg process
    sdpStream.resume();
    console.log("about to pipe...");
    sdpStream.pipe(this._process.stdin);
  }

  kill() {
    if (this._process) {
      console.log("kill() [pid:%d]", this._process.pid);
      this._process.kill("SIGINT");
    }
  }

  get _commandArgs() {
    let commandArgs = [
      "-loglevel",
      "debug",
      "-protocol_whitelist",
      "pipe,udp,rtp",
      "-fflags",
      "+genpts",
      "-f",
      "sdp",
      "-i",
      "pipe:0",
    ];

    commandArgs = commandArgs.concat(this._audioArgs);

    commandArgs = commandArgs.concat([
      "-flags",
      "+global_header",
      `${path.join(__dirname, "../../..")}/jim.opus`,
    ]);

    console.log("commandArgs:%o", commandArgs);

    return commandArgs;
  }

  get _audioArgs() {
    return [
      "-map",
      "0:a:0",
      "-strict", // libvorbis is experimental
      "-2",
      "-acodec",
      "opus",
    ];
  }
}
