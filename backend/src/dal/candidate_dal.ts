import { Candidate } from "@prisma/client";
import { ICandidate } from "@warpy/lib";
import { prisma } from "./client";

export const toCandidateDAL = (data: any): ICandidate => {
  return {
    id: data.id,
    owner: data.owner,
    title: data.title,
    hub: data.hub,
    preview: data.preview,
  };
};

export const CandidateDAL = {
  create: async (data: Candidate): Promise<ICandidate> => {
    const candidate = await prisma.candidate.create({
      data,
    });

    return toCandidateDAL(candidate);
  },

  deleteById: async (id: string) => {
    await prisma.candidate.delete({ where: { id } });
  },

  deleteByOwner: async (owner: string) => {
    await prisma.candidate.delete({ where: { owner } });
  },

  getAll: async (): Promise<ICandidate[]> => {
    const result = await prisma.candidate.findMany();

    return result.map(toCandidateDAL);
  },

  setPreviewClip: async (stream: string, preview: string) => {
    const result = await prisma.candidate.update({
      where: { id: stream },
      data: {
        preview,
      },
    });
  },
};
