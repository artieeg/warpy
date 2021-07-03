import { Stream } from "@app/models";
import * as MessageService from "./message";
import { AccessDeniedError } from "@app/errors";

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
  });

  await stream.save();
  await MessageService.sendNewStreamEvent(stream);

  return stream.id;
};

export const stopStream = async (id: string) => {
  //TODO: implement
};

interface IChangeStreamTitle {
  id: string;
  user: string;
  title: string;
}

export const changeStreamTitle = async (params: IChangeStreamTitle) => {
  //TODO: implement
};
