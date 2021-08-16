import { IBaseUser } from "@warpy/lib";
import { APIClient } from "@warpy/api";
import { createStream, createUser, stopStream } from "./src/procedures";

type UserRecord = {
  user: IBaseUser;
  api: APIClient;
};

let users: UserRecord[] = [];
const N = 100;

const main = async () => {
  const clientRecord = await createUser();

  console.log("created record", clientRecord);

  await createStream(clientRecord);

  console.log("record after creating new stream", clientRecord);

  await stopStream(clientRecord);
  console.log("record after stopping a stream", clientRecord);

  await clientRecord.api.user.delete();
  clientRecord.api.close();
};

main();
