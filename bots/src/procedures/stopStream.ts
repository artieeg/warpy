import { UserRecord } from "../types";

export const stopStream = async (record: UserRecord) => {
  const { api, stream, role } = record;

  if (role === "streamer" && stream) {
    await api.stream.stop(stream);
  }

  record.stream = undefined;
  record.role = undefined;
};
