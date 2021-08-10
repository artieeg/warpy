import {
  User,
  Stream,
  Candidate,
  Participant,
  RefreshToken,
} from "@backend/models";
import { createConnection } from "typeorm";

export const connect = async () => {
  await createConnection({
    type: "postgres",
    host: process.env.POSTGRES,
    port: 5432,
    username: "warpy",
    password: "warpy222",
    database: "warpy",
    entities: [User, Stream, Candidate, Participant, RefreshToken],
    synchronize: true,
  });
};
