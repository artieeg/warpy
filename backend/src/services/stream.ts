import { Stream } from "@app/models";
import mongoose from "mongoose";
import EventEmitter from "events";

interface INewStream {
  owner: string;
  title: string;
  hub: string;
}

export const observer = new EventEmitter();

export const createNewStream = async (params: INewStream) => {
  const { owner, title, hub } = params;

  const stream = new Stream({
    owner,
    title,
    hub,
    live: true,
  });

  await stream.save();
  observer.emit("stream-new", stream);

  return stream.id;
};

export const stopStream = async (id: string, owner: string) => {
  const result = await Stream.updateOne(
    { _id: mongoose.Types.ObjectId(id), owner: mongoose.Types.ObjectId(owner) },
    { $set: { live: false } }
  );

  if (result.nModified === 1) {
    observer.emit("stream-ended", id);
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
