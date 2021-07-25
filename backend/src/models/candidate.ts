import mongoose from "mongoose";

export interface ICandidate {
  id: string;
  owner: string;
  title: string;
  hub: string;
}

const CandidateSchema = new mongoose.Schema<ICandidate>({
  owner: mongoose.Schema.Types.ObjectId,
  hub: mongoose.Schema.Types.ObjectId,
  title: String,
});

CandidateSchema.set("toJSON", {
  virtuals: true,
});

export const Candidate = mongoose.model("Candidate", CandidateSchema);
