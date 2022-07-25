import { Participant } from "@warpy/lib";
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

  unseenRaisedHands: number;

  /** Stream viewers */
  viewers: Record<string, Participant>;

  /** Users sending audio/video streams */
  streamers: Record<string, Participant>;

  viewersWithRaisedHands: Record<string, Participant>;
}

export const createParticipantSlice: StoreSlice<IParticipantSlice> = () => ({
  latestViewersPage: -1,
  unseenRaisedHands: 0,
  isFetchingViewers: false,
  totalParticipantCount: 0,
  viewersWithRaisedHands: {},
  streamers: {},
  viewers: {},
});
