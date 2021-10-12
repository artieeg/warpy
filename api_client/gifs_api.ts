import { APIModule } from "./types";
import { IGifsResponse } from "@warpy/lib";

export interface IGifsAPI {
  get: (page: number) => Promise<IGifsResponse>;
}

export const GifsAPI: APIModule = (socket): IGifsAPI => ({
  get: (page = 0) => socket.request("get-gifs", { page }),
});
