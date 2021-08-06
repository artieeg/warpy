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

export const stopStream = async (stream: string, user: string) => {
  const { stream, user } = data;

  const result = await Stream.updateOne(
    {
      _id: mongoose.Types.ObjectId(stream),
      owner: mongoose.Types.ObjectId(user),
    },
    { $set: { live: false } }
  );

  if (result.nModified === 0) {
    throw new Error();
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
