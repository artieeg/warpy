import { spawn } from "child_process";

export const removeFile = (path: string) => {
  const process = spawn("rm", [path]);

  process.on("error", (data) => {
    console.error("Error while deleting file");
    console.error(data);
  });
};
