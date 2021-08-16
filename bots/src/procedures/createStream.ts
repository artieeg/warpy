import { UserRecord } from "../types";

export const createStream = async (record: UserRecord) => {
  const { user, api } = record;

  const title = `${user.first_name} ${user.last_name}'s stream`;
  const hub = "test";

  const response = await api.stream.create(title, hub);

  console.log("created stream id", response.stream);

  record.stream = response.stream;
  record.role = "streamer";
};
