import { createLoopedVideo } from "./looper";
import { createRecorder, IRecorderParams } from "./recorder";

export const producePreviewClips = (params: IRecorderParams) => {
  let i = 0;

  const createClip = () => {
    if (i === 5) {
      return;
    }

    console.log("creating clip #", i);
    const recorder = createRecorder(params);

    recorder.onRecordingStarted(() => {
      setTimeout(() => {
        recorder.stop();

        createLoopedVideo(recorder.directory, recorder.filename);
        setTimeout(() => createClip(), 5000);
      }, 3000);
    });

    i++;
  };

  createClip();
};
