import { SendMediaStream } from "./types";

export const sendMediaStreamFactory =
  (): SendMediaStream => async (track, kind, sendTransport) => {
    /*
    const track =
      kind === "video" ? media.getVideoTracks()[0] : media.getAudioTracks()[0];
      */

    const producer = await sendTransport.produce({
      track: track as any,
      appData: { kind },
    });

    return producer;
  };
