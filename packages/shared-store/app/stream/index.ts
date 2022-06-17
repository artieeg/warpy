import { IStore } from "../../useStore";
import { AppState } from "../AppState";
import { StreamCreator, StreamCreatorImpl } from "./StreamCreator";
import { StreamJoiner, StreamJoinerImpl } from "./StreamJoiner";

export class StreamService implements StreamJoiner, StreamCreator {
  joiner: StreamJoiner;
  creator: StreamCreator;

  constructor(state: IStore | AppState) {
    this.joiner = new StreamJoinerImpl(state);
    this.creator = new StreamCreatorImpl(state);
  }

  create() {
    return this.creator.create();
  }

  join(params: { stream: string }) {
    return this.joiner.join(params);
  }
}
