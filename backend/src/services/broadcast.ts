import { IParticipant } from "@warpy/lib";

export const broadcastNewViewer = (viewer: IParticipant) => {};

export const broadcastParticipantLeft = (user: string, stream: string) => {};

export const broadcastRaiseHand = (viewer: IParticipant) => {};

export const broadcastNewSpeaker = (speaker: IParticipant) => {};

export const broadcastActiveSpeakers = (
  speaker: IParticipant,
  stream: string
) => {};
