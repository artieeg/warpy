import { MediaServiceRole } from "@warpy/lib";

export const role: MediaServiceRole =
  process.env.ROLE === "PRODUCER" ? "PRODUCER" : "CONSUMER";
