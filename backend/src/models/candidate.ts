import mongoose from "mongoose";

import { ICandidate } from "@warpy/lib";

const CandidateSchema = new mongoose.Schema<ICandidate>({
  owner: mongoose.Schema.Types.ObjectId,
  hub: mongoose.Schema.Types.ObjectId,
  title: String,
});

CandidateSchema.set("toJSON", {
  virtuals: true,
});

export const Candidate = mongoose.model("Candidate", CandidateSchema);
