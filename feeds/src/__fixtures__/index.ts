import { ICandidate, IUser } from "@app/models";
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
