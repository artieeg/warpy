import { spawn } from "child_process";
import { EventEmitter } from "events";
import { Readable } from "stream";

// Converts a string (SDP) to a stream so it can be piped into the FFmpeg process
const convertStringToStream = (stringToConvert: any) => {
  const stream = new Readable();
  stream._read = () => {};
  stream.push(stringToConvert);
  stream.push(null);

  return stream;
};

// Gets codec information from rtpParameters
const getCodecInfoFromRtpParameters = (kind: any, rtpParameters: any) => {
  return {
    payloadType: rtpParameters.codecs[0].payloadType,
    codecName: rtpParameters.codecs[0].mimeType.replace(`${kind}/`, ""),
    clockRate: rtpParameters.codecs[0].clockRate,
    channels: kind === "audio" ? rtpParameters.codecs[0].channels : undefined,
  };
};

const createSdpText = (rtpParameters: any) => {
  const { video, audio } = rtpParameters;

  // Video codec info
  const videoCodecInfo = getCodecInfoFromRtpParameters(
    "video",
    video.rtpParameters
  );

  /*
  // Audio codec info
  const audioCodecInfo = getCodecInfoFromRtpParameters(
    "audio",
    audio.rtpParameters
  );
  */

  return `v=0
  o=- 0 0 IN IP4 127.0.0.1
  s=FFmpeg
  c=IN IP4 127.0.0.1
  t=0 0
  m=video ${video.remoteRtpPort} RTP/AVP ${videoCodecInfo.payloadType} 
  a=rtpmap:${videoCodecInfo.payloadType} ${videoCodecInfo.codecName}/${videoCodecInfo.clockRate}
  a=sendonly
  `;
  //m=audio ${audio.remoteRtpPort} RTP/AVP ${audioCodecInfo.payloadType}
  //a=rtpmap:${audioCodecInfo.payloadType} ${audioCodecInfo.codecName}/${audioCodecInfo.clockRate}/${audioCodecInfo.channels}
  //a=sendonly
};

const RECORD_FILE_LOCATION_PATH =
  process.env.RECORD_FILE_LOCATION_PATH || "./files";

export class FFmpeg {
  _rtpParameters: any;
  _process: any;
  _observer: any;

  constructor(rtpParameters: any) {
    this._rtpParameters = rtpParameters;
    this._process = undefined;
    this._observer = new EventEmitter();
    this._createProcess();
  }

  _createProcess() {
    const sdpString = createSdpText(this._rtpParameters);
    const sdpStream = convertStringToStream(sdpString);

    console.log("createProcess() [sdpString:%s]", sdpString);

    this._process = spawn("ffmpeg", this._commandArgs);

    if (this._process.stderr) {
      this._process.stderr.setEncoding("utf-8");

      this._process.stderr.on("data", (data: any) =>
        console.log("ffmpeg::process::data [data:%o]", data)
      );
    }

    if (this._process.stdout) {
      this._process.stdout.setEncoding("utf-8");

      this._process.stdout.on("data", (data: any) =>
        console.log("ffmpeg::process::data [data:%o]", data)
      );
    }

    this._process.on("message", (message: any) =>
      console.log("ffmpeg::process::message [message:%o]", message)
    );

    this._process.on("error", (error: any) =>
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
    sdpStream.pipe(this._process.stdin);
  }

  kill() {
    console.log("kill() [pid:%d]", this._process.pid);
    this._process.kill("SIGINT");
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

    commandArgs = commandArgs.concat(this._videoArgs);
    //commandArgs = commandArgs.concat(this._audioArgs);

    commandArgs = commandArgs.concat([
      "-flags",
      "+global_header",
      `./test.webm`,
    ]);

    console.log("commandArgs:%o", commandArgs);

    return commandArgs;
  }

  get _videoArgs() {
    return ["-map", "0:v:0", "-c:v", "copy"];
  }

  get _audioArgs() {
    return [
      "-map",
      "0:a:0",
      "-strict", // libvorbis is experimental
      "-2",
      "-c:a",
      "copy",
    ];
  }
}
