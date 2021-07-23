import { ServiceRole } from "./types";

export const role: ServiceRole =
  process.env.ROLE === "PRODUCER" ? "PRODUCER" : "CONSUMER";
