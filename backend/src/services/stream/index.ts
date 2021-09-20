import { createNewStream } from "./createNewStream";
import { addNewViewer } from "./addNewViewer";
import { stopStream } from "./stopStream";
import { removeUserFromStreams } from "./removeUserFromStreams";
import { getViewers } from "./getViewers";
import { setHandRaise } from "./setHandRaise";
import { allowSpeaker } from "./allowSpeaker";
import { updateActiveSpeakers } from "./updateActiveSpeakers";
import { countNewReaction, runReactionSync } from "./countNewReaction";
import { onReactionUpdate } from "./observer";
import { kickFromStream } from "./kickFromStream";

export const StreamService = {
  createNewStream,
  addNewViewer,
  stopStream,
  removeUserFromStreams,
  getViewers,
  setHandRaise,
  allowSpeaker,
  updateActiveSpeakers,
  onReactionUpdate,
  runReactionSync,
  countNewReaction,
  kickFromStream,
};
