import { APIModule } from "./types";
import { GifsResponse } from "@warpy/lib";

export interface IGifsAPI {
  search: (search: string, next?: string) => Promise<GifsResponse>;
  getTrending: (next?: string) => Promise<GifsResponse>;
}

export const GifsAPI: APIModule = (socket): IGifsAPI => ({
  search: (search, next) => socket.request("search-gifs", { next, search }),
  getTrending: (next) => socket.request("get-trending-gifs", { next }),
});
