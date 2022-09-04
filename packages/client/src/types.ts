import { Consumer } from "mediasoup-client/lib/types";
import { Store } from "./Store";

export type MediaStreamMap = Record<
  string,
  {
    consumer: Consumer;
    stream: any;
    enabled: boolean;
  }
>;

export type StateSetter = (
  state: Partial<Store> | ((draft: Store) => void)
) => any;

export type StateGetter = () => Store;
