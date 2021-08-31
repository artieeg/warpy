import { createNewStream } from "./createNewStream";
import { addNewViewer } from "./addNewViewer";
import { stopStream } from "./stopStream";
import { removeUserFromStreams } from "./removeUserFromStreams";
import { getViewers } from "./getViewers";
import { setHandRaise } from "./setHandRaise";
import { allowSpeaker } from "./allowSpeaker";
import { updateActiveSpeakers } from "./updateActiveSpeakers";

export const StreamService = {
  createNewStream,
  addNewViewer,
  stopStream,
  removeUserFromStreams,
  getViewers,
  setHandRaise,
  allowSpeaker,
  updateActiveSpeakers,
};
