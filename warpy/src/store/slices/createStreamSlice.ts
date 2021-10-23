export interface IStreamSlice {
  stream: string | null;
  title: string | null;
  isStreamOwner: boolean;
}

export const createStreamSlice = (): IStreamSlice => ({
  stream: null,
  isStreamOwner: false,
  title: null,
});
