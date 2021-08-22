import { EventEmitter } from "events";
import { IRecordRequest } from "@warpy/lib";
import { createLoopedVideo } from "./looper";
import { createClipsManager } from "./recorder";

type PreviewProducer = {
  onNewPreview: (
    cb: (params: { filename: string; directory: string }) => any
  ) => any;
};

export const createPreviewsProducer = (
  params: IRecordRequest
): PreviewProducer => {
  const clipRecordManager = createClipsManager({
    recordParams: params,
    clip: {
      duration: 3000,
      interval: 5000,
    },
  });

  const observer = new EventEmitter();

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
    });
  });

  return {
    onNewPreview: (cb) => observer.on("preview-ready", cb),
  };
};
