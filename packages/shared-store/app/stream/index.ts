import { IParticipant } from "@warpy/lib";
import { IStore } from "../../useStore";
import { AppState } from "../AppState";
import { StreamCreator, StreamCreatorImpl } from "./StreamCreator";
import { StreamJoiner, StreamJoinerImpl } from "./StreamJoiner";
import { StreamLeaver, StreamLeaverImpl } from "./StreamLeaver";
import { StreamReaction, StreamReactionImpl } from "./StreamReaction";
import {
  StreamParticipantManager,
  StreamParticipantManagerImpl,
} from "./StreamParticipantManager";
import {
  AudioLevelRecord,
  AudioLevelsUpdater,
  AudioLevelsUpdaterImpl,
} from "./AudioLevelsUpdater";
import { Service } from "../Service";

export class StreamService
  extends Service
  implements
    StreamJoiner,
    StreamCreator,
    StreamParticipantManager,
    AudioLevelsUpdater,
    StreamReaction
{
  private reaction: StreamReaction;
  private joiner: StreamJoiner;
  private creator: StreamCreator;
  private leaver: StreamLeaver;
  private audioLevels: AudioLevelsUpdater;
  private participantManager: StreamParticipantManager;

  constructor(state: IStore | AppState) {
    super(state);

    this.reaction = new StreamReactionImpl(this.state);
    this.joiner = new StreamJoinerImpl(this.state);
    this.creator = new StreamCreatorImpl(this.state);
    this.leaver = new StreamLeaverImpl(this.state);
    this.participantManager = new StreamParticipantManagerImpl(this.state);
    this.audioLevels = new AudioLevelsUpdaterImpl(this.state);
  }

  setNewStreamTitle(title: string) {
    return this.creator.setNewStreamTitle(title);
  }

  change(reaction: string) {
    return this.reaction.change(reaction);
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
