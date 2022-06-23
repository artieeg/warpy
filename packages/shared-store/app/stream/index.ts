import { IParticipant } from "@warpy/lib";
import { IStore } from "../../useStore";
import { AppState } from "../AppState";
import { StreamCreator, StreamCreatorImpl } from "./StreamCreator";
import { StreamJoiner, StreamJoinerImpl } from "./StreamJoiner";
import { StreamLeaver, StreamLeaverImpl } from "./StreamLeaver";
import {
  StreamParticipantManager,
  StreamParticipantManagerImpl,
} from "./StreamParticipantManager";

export class StreamService
  implements StreamJoiner, StreamCreator, StreamParticipantManager
{
  private joiner: StreamJoiner;
  private creator: StreamCreator;
  private leaver: StreamLeaver;
  private participantManager: StreamParticipantManager;

  constructor(state: IStore | AppState) {
    this.joiner = new StreamJoinerImpl(state);
    this.creator = new StreamCreatorImpl(state);
    this.leaver = new StreamLeaverImpl(state);
    this.participantManager = new StreamParticipantManagerImpl(state);
  }

  fetchStreamViewers() {
    return this.participantManager.fetchStreamViewers();
  }

  addStreamParticipant(participant: IParticipant) {
    return this.participantManager.addStreamParticipant(participant);
  }

  removeStreamParticipant(user: string) {
    return this.participantManager.removeStreamParticipant(user);
  }

  updateStreamParticipant(user: IParticipant) {
    return this.participantManager.updateStreamParticipant(user);
  }

  create() {
    return this.creator.create();
  }

  join(params: { stream: string }) {
    return this.joiner.join(params);
  }

  leave(params: { shouldStopStream: boolean; stream: string }) {
    return this.leaver.leave(params);
  }
}
