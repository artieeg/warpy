import { spawn } from "child_process";

type LoopedVideo = {
  directory: string;
  filename: string;
};

export const createLoopedVideo = (
  directory: string,
  filename: string
): Promise<LoopedVideo> => {
  return new Promise((resolve, reject) => {
    const loopFileName = `preview_${filename}`;
    const loopFilePath = directory + loopFileName;

    const process = spawn("ffmpeg", [
      "-i",
      directory + filename,
      "-filter_complex",
      "[0]reverse[r];[0][r]concat=n=2:v=1:a=0,setpts=N/55/TB",
      loopFilePath,
    ]);

    if (process.stderr) {
      process.stderr.setEncoding("utf-8");

      process.stderr.on("data", () => {
        //console.log("looper [data:%o]", data);
      });
    }

    if (process.stdout) {
      process.stdout.setEncoding("utf-8");

      process.stdout.on("data", () => {
        //console.log("looper [data:%o]", data);
      });
    }

    process.on("message", () => {
      //console.log("looper message:", message);
    });

    process.on("error", (error) => {
      console.error("looper error:", error);
      reject();
    });

    process.on("close", () => {
      resolve({
        directory,
        filename,
      });
    });
  });
};
