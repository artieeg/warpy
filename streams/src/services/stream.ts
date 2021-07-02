interface INewStream {
  owner: string;
  title: string;
  hub: string;
}

export const createNewStream = async (params: INewStream) => {
  const { owner, title, hub } = params;

  return "mock-id";
};
