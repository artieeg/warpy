import { EventEmitter } from "events";
import { spawn } from "child_process";

type Looper = {
  onLoopCreated: (
    cb: (params: { directory: string; filename: string }) => any
  ) => any;
};

export const createLoopedVideo = (
  directory: string,
  filename: string
): Looper => {
  const loopFileName = directory + `preview_${filename}`;

  const process = spawn("ffmpeg", [
    "-i",
    directory + filename,
    "-filter_complex",
    "[0]reverse[r];[0][r]concat=n=2:v=1:a=0,setpts=N/55/TB",
    loopFileName,
  ]);

  if (process.stderr) {
    process.stderr.setEncoding("utf-8");

    process.stderr.on("data", (data) => {
      //console.log("looper [data:%o]", data);
    });
  }

  if (process.stdout) {
    process.stdout.setEncoding("utf-8");

    process.stdout.on("data", (data) => {
      //console.log("looper [data:%o]", data);
    });
  }

  process.on("message", (message) => {
    //console.log("looper message:", message);
  });

  process.on("error", (error) => {
    console.error("looper error:", error);
  });

  const observer = new EventEmitter();

  process.on("close", () => {
    observer.emit("loop-created", {
      directory,
      filename: loopFileName,
    });
  });

  return {
    onLoopCreated: (cb) => observer.on("loop-created", cb),
  };
};
