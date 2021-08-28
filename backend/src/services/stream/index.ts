import { createNewStream } from "./createNewStream";
import { addNewViewer } from "./addNewViewer";
import { stopStream } from "./stopStream";
import { removeUser } from "./removeUser";
import { getViewers } from "./getViewers";
import { setHandRaise } from "./setHandRaise";
import { allowSpeaker } from "./allowSpeaker";
import { updateActiveSpeakers } from "./updateActiveSpeakers";

export const StreamService = {
  createNewStream,
  addNewViewer,
  stopStream,
  removeUser,
  getViewers,
  setHandRaise,
  allowSpeaker,
  updateActiveSpeakers,
};
