import { IStore } from "../../useStore";
import { AppState } from "../AppState";
import { StreamCreator, StreamCreatorImpl } from "./StreamCreator";
import { StreamJoiner, StreamJoinerImpl } from "./StreamJoiner";
import { StreamLeaver, StreamLeaverImpl } from "./StreamLeaver";

export class StreamService implements StreamJoiner, StreamCreator {
  joiner: StreamJoiner;
  creator: StreamCreator;
  leaver: StreamLeaver;

  constructor(state: IStore | AppState) {
    this.joiner = new StreamJoinerImpl(state);
    this.creator = new StreamCreatorImpl(state);
    this.leaver = new StreamLeaverImpl(state);
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
