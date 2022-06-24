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
import {
  AudioLevelRecord,
  AudioLevelsUpdater,
  AudioLevelsUpdaterImpl,
} from "./AudioLevelsUpdater";

export class StreamService
  implements
    StreamJoiner,
    StreamCreator,
    StreamParticipantManager,
    AudioLevelsUpdater
{
  private joiner: StreamJoiner;
  private creator: StreamCreator;
  private leaver: StreamLeaver;
  private audioLevels: AudioLevelsUpdater;
  private participantManager: StreamParticipantManager;

  constructor(state: IStore | AppState) {
    this.joiner = new StreamJoinerImpl(state);
    this.creator = new StreamCreatorImpl(state);
    this.leaver = new StreamLeaverImpl(state);
    this.participantManager = new StreamParticipantManagerImpl(state);
    this.audioLevels = new AudioLevelsUpdaterImpl(state);
  }

  updateAudioLevels(levels: AudioLevelRecord[]) {
    return this.audioLevels.updateAudioLevels(levels);
  }

  delAudioLevel(user: string) {
    return this.audioLevels.delAudioLevel(user);
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
