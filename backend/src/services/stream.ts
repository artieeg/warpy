import { IStream, Stream } from "@backend/models";
import mongoose from "mongoose";
import EventEmitter from "events";

export const observer = new EventEmitter();

export const createNewStream = async (
  owner: string,
  title: string,
  hub: string
): Promise<IStream> => {
  const stream = new Stream({
    owner,
    title,
    hub,
    live: true,
  });

  await stream.save();
  return stream;
};

export const stopStream = async (data: any) => {
  const { stream, user } = data;

  const result = await Stream.updateOne(
    {
      _id: mongoose.Types.ObjectId(stream),
      owner: mongoose.Types.ObjectId(user),
    },
    { $set: { live: false } }
  );

  if (result.nModified === 1) {
    observer.emit("stream-stop", stream);
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
