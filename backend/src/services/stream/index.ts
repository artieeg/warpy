import { createNewStream } from "./createNewStream";
import { addNewViewer } from "./addNewViewer";
import { stopStream } from "./stopStream";
import { removeUserFromStreams } from "./removeUserFromStreams";
import { getViewers } from "./getViewers";
import { setHandRaise } from "./setHandRaise";
import { allowSpeaker } from "./allowSpeaker";
import { updateActiveSpeakers } from "./updateActiveSpeakers";
import { countNewClap } from "./countNewClap";
import { onClapsUpdate } from "./observer";
import { runClapsSync } from "./countNewClap";

export const StreamService = {
  createNewStream,
  addNewViewer,
  stopStream,
  removeUserFromStreams,
  getViewers,
  setHandRaise,
  allowSpeaker,
  updateActiveSpeakers,
  countNewClap,
  onClapsUpdate,
  runClapsSync,
};
