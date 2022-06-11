import { IChatMessage } from "@warpy/lib";
import { StoreSlice } from "../types";

export interface IChatSlice {
  messageInputValue: string;
  messages: IChatMessage[];
}

export const createChatSlice: StoreSlice<IChatSlice> = () => ({
  messageInputValue: "",
  messages: [],
});
