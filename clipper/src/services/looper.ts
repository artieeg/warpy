import { spawn } from "child_process";

export const createLoopedVideo = (directory: string, filename: string) => {
  const process = spawn("ffmpeg", [
    "-i",
    directory + filename,
    "-filter_complex",
    "[0]reverse[r];[0][r]concat=n=2:v=1:a=0,setpts=N/55/TB",
    directory + `preview_${filename}`,
  ]);

  if (process.stderr) {
    process.stderr.setEncoding("utf-8");

    process.stderr.on("data", (data) => {
      console.log("looper [data:%o]", data);
    });
  }

  if (process.stdout) {
    process.stdout.setEncoding("utf-8");

    process.stdout.on("data", (data) => {
      console.log("looper [data:%o]", data);
    });
  }

  process.on("message", (message) => {
    console.log("looper message:", message);
  });

  process.on("error", (error) => {
    console.error("looper error:", error);
  });

  process.on("close", () => {});
};
