import { IParticipant } from "@warpy/lib";
import { StoreSlice } from "../types";

export interface IParticipantSlice {
  /** Stores latest fetched viewers page*/
  latestViewersPage: number;

  /**
   * Initialized after joining.
   * Updates once a new user joins or leaves the stream
   * */
  totalParticipantCount: number;

  isFetchingViewers: boolean;

  /** Stream viewers */
  viewers: Record<string, IParticipant>;

  /** Users sending audio/video streams */
  streamers: Record<string, IParticipant>;

  viewersWithRaisedHands: Record<string, IParticipant>;
}

export const createParticipantSlice: StoreSlice<IParticipantSlice> = () => ({
  latestViewersPage: -1,
  isFetchingViewers: false,
  totalParticipantCount: 0,
  viewersWithRaisedHands: {},
  streamers: {},
  viewers: {},
});
