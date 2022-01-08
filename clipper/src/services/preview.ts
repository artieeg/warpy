import { EventEmitter } from "events";
import { IRecordRequest } from "@warpy/lib";
import { createLoopedVideo } from "./looper";
import { clips, createMediaRecorder } from "./recorder";
import { removeFile } from "./cleaner";

type PreviewProducer = {
  onNewPreview: (
    cb: (params: { filename: string; directory: string }) => any
  ) => any;
  removePreview: (preview: any) => any;
};

export const startProducingPreviews = (stream: string): PreviewProducer => {
  const observer = new EventEmitter();

  setInterval(() => {
    //TODO: ARRANGE VIDS

    const streams = Object.values(clips[stream]);

    streams.forEach(async ({ directory, filename }) => {
      const loopedVideo = await createLoopedVideo(directory, filename);
      console.log("looped vidoe", loopedVideo);
    });
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
