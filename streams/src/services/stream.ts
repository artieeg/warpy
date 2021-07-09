import { Stream } from "@app/models";
import * as MessageService from "./message";
import mongoose from "mongoose";

interface INewStream {
  owner: string;
  title: string;
  hub: string;
}

export const createNewStream = async (params: INewStream) => {
  const { owner, title, hub } = params;

  const stream = new Stream({
    owner,
    title,
    hub,
    live: true,
  });

  await stream.save();
  await MessageService.sendNewStreamEvent(stream);

  return stream.id;
};

export const stopStream = async (id: string, owner: string) => {
  const result = await Stream.updateOne(
    { _id: mongoose.Types.ObjectId(id), owner: mongoose.Types.ObjectId(owner) },
    { $set: { live: false } }
  );

  if (result.nModified === 1) {
    await MessageService.sendStreamEndedEvent(id);
  }
};

interface IChangeStreamTitle {
  id: string;
  user: string;
  title: string;
}

export const changeStreamTitle = async (params: IChangeStreamTitle) => {
  //TODO: implement
};
