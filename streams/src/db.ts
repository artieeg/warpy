import mongoose from "mongoose";

export const connect = async () => {
  const url = process.env.MONGODB_CONN;

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
