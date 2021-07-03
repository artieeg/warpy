import { Stream } from "@app/models";

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

  return stream.id;
};
