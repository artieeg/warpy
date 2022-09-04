import { StateGetter, StateSetter } from "./types";

export abstract class Service<T> {
  constructor(protected set: StateSetter, protected get: StateGetter) {}

  abstract getInitialState(): Partial<T>;
}
