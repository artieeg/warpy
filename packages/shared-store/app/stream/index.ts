import { IStore } from "../../useStore";
import { StreamJoiner, StreamJoinerImpl } from "./StreamJoiner";

export class StreamService implements StreamJoiner {
  joiner: StreamJoiner;

  constructor(state: IStore) {
    this.joiner = new StreamJoinerImpl(state);
  }

  join(params) {
    return this.joiner.join(params);
  }
}
