import { spawn } from "child_process";

export const removeFile = async (path: string) => {
  return new Promise<void>((resolve) => {
    const process = spawn("rm", [path]);

    process.on("error", (data) => {
      console.error("Error while deleting file");
      console.error(data);
    });

    process.on("exit", () => {
      resolve();
    });
  });
};
