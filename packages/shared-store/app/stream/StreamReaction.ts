import { AppState } from "../AppState";
import { StateUpdate } from "../types";

export interface StreamReaction {
  change: (reaction: string) => StateUpdate;
}

export class StreamReactionImpl {
  constructor(private state: AppState) {}

  change(reaction: string) {
    return this.state.update({
      reaction,
    });
  }
}
