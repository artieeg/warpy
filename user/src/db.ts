import mongoose from "mongoose";

export const connect = async () => {
  const url = process.env.MONGODB_CONN;

  if (!url) {
    throw new Error("mongo url");
  }

  await mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
};
