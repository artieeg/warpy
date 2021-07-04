import { ICandidate, IStats, IUser } from "@app/models";
export const createCandidateFixture = (data: Partial<ICandidate>) => {
  const fixture = {
    id: "test-id",
    owner: "test-owner-id",
    hub: "test-hub-id",
    title: "test title",
  };

  return { ...fixture, ...data };
};

export const createUserFixture = (data: Partial<IUser>) => {
  const fixture = {
    id: "test-user-id",
    last_name: "Doe",
    first_name: "John",
    username: "test",
    avatar: "avatar.com/test",
  };

  return { ...fixture, ...data };
};

export const createStatsFixture = (data: Partial<IStats>) => {
  const fixture = {
    id: "test-stream-id",
    claps: 1000,
    participants: 30,
    score: 1.3,
  };

  return { ...fixture, ...data } as IStats;
};
