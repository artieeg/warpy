import { Candidate } from "@prisma/client";
import { ICandidate } from "@warpy/lib";
import { prisma } from "./client";

export const toCandidateDTO = (data: Candidate): ICandidate => {
  return {
    id: data.id,
    owner: data.owner,
    title: data.title,
    hub: data.hub,
    preview: data.preview,
    participants: 0,
    speakers: [],
  };
};

export const CandidateDAL = {
  create: async (data: Candidate): Promise<ICandidate> => {
    const candidate = await prisma.candidate.create({
      data,
    });

    return toCandidateDTO(candidate);
  },

  async deleteById(id: string): Promise<void> {
    await prisma.candidate.delete({ where: { id } });
  },

  async deleteByOwner(owner: string): Promise<void> {
    await prisma.candidate.delete({ where: { owner } });
  },

  async getAll(hub?: string): Promise<ICandidate[]> {
    const result = await prisma.candidate.findMany({
      where: { preview: { not: null }, hub },
    });

    return result.map(toCandidateDTO);
  },

  async setPreviewClip(stream: string, preview: string): Promise<void> {
    await prisma.candidate.update({
      where: { id: stream },
      data: {
        preview,
      },
    });
  },
};
