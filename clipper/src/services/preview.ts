import { EventEmitter } from "events";
import { spawn } from "child_process";
import { clips } from "./recorder";
import { removeFile } from "./cleaner";

type PreviewProducer = {
  onNewPreview: (
    cb: (params: { filename: string; directory: string }) => any
  ) => any;
  removePreview: (preview: any) => any;
};

export const startProducingPreviews = (stream: string): PreviewProducer => {
  const observer = new EventEmitter();

  setInterval(async () => {
    const sources = Object.values(clips[stream]).map(
      ({ directory, filename }) => directory + filename
    );

    const preview = await produceStreamPreview(stream, sources);

    console.log({ preview });
  }, 10000);

  /*
  clipRecordManager.onClipReady((clipInfo) => {
    const loopManager = createLoopedVideo(
      clipInfo.directory,
      clipInfo.filename
    );

    loopManager.onLoopCreated((loopInfo) => {
      observer.emit("preview-ready", {
        directory: loopInfo.directory,
        filename: loopInfo.filename,
      });

      //removeFile(clipInfo.directory + clipInfo.filename);
    });
  });
  */

  return {
    onNewPreview: (cb) => observer.on("preview-ready", cb),
    removePreview: (preview: any) => {
      removeFile(preview.directory + preview.filename);
    },
  };
};

const filters = [
  "[0]reverse[r];[0][r]concat=n=2:v=1:a=0,setpts=N/55/TB", //one stream -- just loop and speed up
  "[0:v][1:v]vstack=inputs=2[v]", //two streams -- stack
  "[0:v][1:v][2:v]vstack=inputs=3[v]", //three streams -- stack
  "", //TODO
];

const produceStreamPreview = async (id: string, sources: string[]) => {
  let args: string[] = [];

  sources.forEach((source) => {
    args.push("-i");
    args.push(source);
  });

  const output = `./recordings/preview_${id}.webm`;

  const filter = filters[sources.length - 1];
  args.push("-filter_complex");
  args.push(filter);
  args.push(output);

  const process = spawn("ffmpeg", args);

  return new Promise<string>((resolve) => {
    process.on("close", () => {
      resolve(output);
    });
  });
};
