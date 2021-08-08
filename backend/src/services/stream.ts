import { IStream, Stream } from "@backend/models";
import mongoose from "mongoose";
import EventEmitter from "events";

export const observer = new EventEmitter();

export const createNewStream = async (
  owner: string,
  title: string,
  hub: string
): Promise<IStream> => {
  const stream = Stream.fromJSON({
    owner,
    title,
    hub,
    live: true,
  });

  console.log("creating stream");

  await stream.save();

  console.log("stream id", stream.id);

  return stream;
};
