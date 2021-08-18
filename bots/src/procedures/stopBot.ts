import { UserRecord } from "../types";

export const stopBot = async (record: UserRecord) => {
  record.consumers?.forEach((consumer) => consumer.close());
  record.producers?.forEach((producer) => producer.close());

  await record.api.user.delete();
  record.api.close();
};
