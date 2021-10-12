import { APIModule } from "./types";
import { IGifsResponse } from "@warpy/lib";

export interface IGifsAPI {
  search: (search: string, next?: string) => Promise<IGifsResponse>;
  getTrending: (next?: string) => Promise<IGifsResponse>;
}

export const GifsAPI: APIModule = (socket): IGifsAPI => ({
  search: (search, next) => socket.request("search-gifs", { next, search }),
  getTrending: (next) => socket.request("get-trending-gifs", { next }),
});
