import { createAPIClient } from "../utils";
import { UserRecord } from "../types";
import {
  adjectives,
  animals,
  uniqueNamesGenerator,
} from "unique-names-generator";
import { createDevice } from "../media";
import { MediaClient } from "@warpykit-sdk/client";

export const createUser = async (): Promise<UserRecord> => {
  const api = await createAPIClient("ws://127.0.0.1:9999/ws");

  const [first_name, last_name] = uniqueNamesGenerator({
    dictionaries: [animals, adjectives],
    separator: " ",
  }).split(" ");

  const { access } = await api.user.create({
    username: `${first_name}_${last_name}`,
    first_name,
    last_name,
    email: "monki@banancorp.com",
    kind: "dev",
    avatar: "https://c.tenor.com/24aVYR7egHEAAAAC/cute-dog.gif",
  });

  const { user } = await api.user.auth(access);

  if (!user) {
    throw new Error("User is null");
  }

  return {
    user,
    api,
    recvDevice: createDevice(),
    sendDevice: createDevice(),
    media: new MediaClient(
      createDevice() as any,
      createDevice() as any,
      api,
      ""
    ),
  };
};