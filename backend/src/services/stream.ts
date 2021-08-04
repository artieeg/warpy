import { Stream } from "@app/models";
import mongoose from "mongoose";
import EventEmitter from "events";
import { MessageHandler } from "@warpy/lib";

interface INewStream {
  owner: string;
  title: string;
  hub: string;
}

export const observer = new EventEmitter();

export const onCreateNewStream: MessageHandler<INewStream, any> = async (
  params,
  respond
) => {
  const { owner, title, hub } = params;

  const stream = new Stream({
    owner,
    title,
    hub,
    live: true,
  });

  await stream.save();
  observer.emit("stream-new", stream);

  respond!({
    stream: stream.id,
  });
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
