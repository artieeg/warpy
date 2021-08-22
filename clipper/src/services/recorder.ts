import { spawn } from "child_process";
import EventEmitter from "events";
import { IRecordRequest } from "@warpy/lib";
import { convertStringToStream, createSdpText } from "./utils";

export interface IClipRecorder {
  filename: string;
  directory: string;
  stop: () => void;
  onRecordingStarted: (cb: any) => void;
}

export interface IRecorderParams {
  recordParams: IRecordRequest;
  clip: {
    duration: number;
    interval: number;
  };
}

type NewClipInfo = {
  directory: string;
  filename: string;
};

interface ClipRecorderManager {
  onClipReady: (cb: (params: NewClipInfo) => any) => any;
  stop: () => void;
}

export const createClipsManager = (
  params: IRecorderParams
): ClipRecorderManager => {
  const { clip } = params;
  const observer = new EventEmitter();

  const { duration, interval } = clip;

  let clipDurationTimeout: any;
  let intervalBetweenClips: any;

  const recordNewClip = () => {
    const recorder = startRecordingClip(params);

    clipDurationTimeout = recorder.onRecordingStarted(() => {
      setTimeout(() => {
        recorder.stop();

        observer.emit("clip-is-ready", {
          directory: recorder.directory,
          filename: recorder.filename,
        });

        intervalBetweenClips = setTimeout(() => recordNewClip(), interval);
      }, duration);
    });
  };

  recordNewClip();

  return {
    onClipReady: (cb: (params: NewClipInfo) => any) =>
      observer.on("clip-is-ready", cb),
    stop: () => {
      clearTimeout(clipDurationTimeout);
      clearTimeout(intervalBetweenClips);
    },
  };
};

export const startRecordingClip = (params: IRecorderParams): IClipRecorder => {
  const { recordParams } = params;

  const { rtpParameters, remoteRtpPort } = recordParams;

  const directory = "./recordings/";
  const filename = `recording_${Date.now()}.webm`;
  const path = directory + filename;

  const observer = new EventEmitter();
  const process = spawn("ffmpeg", getCommandArgs(path));

  const onRecordingStarted = (cb: any) => observer.on("recording-started", cb);

  let startedRecording = false;

  if (process.stderr) {
    process.stderr.setEncoding("utf-8");

    process.stderr.on("data", (data) => {
      if (startedRecording) {
        return;
      }

      if (data.includes("Writing block of size")) {
        startedRecording = true;
        observer.emit("recording-started");
      }
      //console.log("ffmpeg::process::data [data:%o]", data);
    });
  }

  if (process.stdout) {
    process.stdout.setEncoding("utf-8");

    process.stdout.on("data", (data) => {
      if (startedRecording) {
        return;
      }

      if (data.includes("Writing block of size")) {
        startedRecording = true;
        observer.emit("recording-started");
      }
      //console.log("ffmpeg::process::data [data:%o]", data)
    });
  }

  process.on("message", (message) => {
    //console.log("ffmpeg message:", message);
  });

  process.on("error", (error) => {
    //console.error("ffmpeg error:", error);
    observer.emit("error", error);
  });

  process.on("close", () => {
    observer.emit("close");
  });

  const sdpStream = convertStringToStream(
    createSdpText(rtpParameters, remoteRtpPort)
  );

  sdpStream.on("error", (_error) => {
    //console.error("ffmpeg sdp error", error);
  });

  sdpStream.resume();
  sdpStream.pipe(process.stdin);

  const stop = () => {
    process.kill("SIGINT");
  };

  return {
    filename,
    directory,
    stop,
    onRecordingStarted,
  };
};

const getCommandArgs = (outputFileName: string) => {
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

  commandArgs = commandArgs.concat(["-map", "0:v:0", "-c:v", "copy"]);

  //commandArgs = commandArgs.concat(["-f", "segment", "-segment_time", "3"]);
  //`${outputFileName}_%03d.webm`,

  commandArgs = commandArgs.concat([
    "-flags",
    "+global_header",
    `${outputFileName}`,
  ]);

  return commandArgs;
};
