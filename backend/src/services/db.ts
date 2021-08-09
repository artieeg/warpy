import mongoose from "mongoose";
import { User, Stream, Candidate } from "@backend/models";
import { createConnection } from "typeorm";

export const connect = async () => {
  const url = process.env.MONGODB_CONN;

  console.log("pg", process.env.POSTGRES);

  await createConnection({
    type: "postgres",
    host: process.env.POSTGRES,
    port: 5432,
    username: "warpy",
    password: "warpy222",
    database: "warpy",
    entities: [User, Stream, Candidate],
    synchronize: true,
  });

  if (!url) {
    throw new Error("mongo url");
  }

  await mongoose.connect(url, {
    dbName: "warpy",
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
};
