import { IStore } from "../../useStore";
import { StreamCreator, StreamCreatorImpl } from "./StreamCreator";
import { StreamJoiner, StreamJoinerImpl } from "./StreamJoiner";

export class StreamService implements StreamJoiner, StreamCreator {
  joiner: StreamJoiner;
  creator: StreamCreator;

  constructor(state: IStore) {
    this.joiner = new StreamJoinerImpl(state);
    this.creator = new StreamCreatorImpl(state);
  }

  create() {
    return this.creator.create();
  }

  join(params) {
    return this.joiner.join(params);
  }
}
