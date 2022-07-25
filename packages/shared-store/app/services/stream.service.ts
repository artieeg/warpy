import { IStore } from "../Store";
import { AppState } from "../AppState";
import { Service } from "../Service";
import { ModalService } from "./modal.service";
import { MediaService } from "./media.service";
import { Participant, reactionCodes, StreamCategory } from "@warpy/lib";
import { arrayToMap } from "../utils";
import { InviteService } from "./invite.service";

export interface StreamData {
  stream: string | null;
  title: string | null;
  currentStreamHost: string;
  newStreamCategory: StreamCategory | null;
  selectedFeedCategory: StreamCategory | null;
  userAudioLevels: Record<string, number>;
  isStartingNewStream: boolean;
  reaction: string;

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

export class StreamService extends Service<StreamData> {
  private modal: ModalService;
  private media: MediaService;
  private invite: InviteService;

  constructor(state: IStore | AppState) {
    super(state);

    this.modal = new ModalService(this.state);
    this.media = new MediaService(this.state);
    this.invite = new InviteService(this.state);
  }

  getInitialState() {
    return {
      stream: null,
      userAudioLevels: {},
      currentStreamHost: "",
      title: "",
      newStreamCategory: null,
      isStartingNewStream: false,
      selectedFeedCategory: null,
      reaction: reactionCodes[0],
      latestViewersPage: -1,
      unseenRaisedHands: 0,
      isFetchingViewers: false,
      totalParticipantCount: 0,
      viewersWithRaisedHands: {},
      streamers: {},
      viewers: {},
    };
  }

  changeReaction(reaction: string) {
    return this.state.update({
      reaction,
    });
  }

  async *fetchStreamViewers() {
    yield this.state.update({
      isFetchingViewers: true,
    });

    const { api, latestViewersPage: page, stream } = this.state.get();

    if (!stream) {
      return;
    }

    const { viewers } = await api.stream.getViewers(stream, page + 1);

    yield this.state.update((state) => {
      state.isFetchingViewers = false;
      for (const viewer of viewers) {
        state.viewers[viewer.id] = viewer;
      }
    });
  }

  private clearMediaFrom(user: string) {
    const { videoStreams, audioStreams } = this.state.get();

    const video = videoStreams[user];
    const audio = audioStreams[user];

    if (video) {
      video.consumer.close();
    }

    if (audio) {
      audio.consumer.close();
    }

    return this.state.update((state) => {
      delete state.videoStreams[user];
      delete state.audioStreams[user];
    });
  }

  async removeStreamParticipant(user: string) {
    this.clearMediaFrom(user);

    return this.state.update((state) => {
      delete state.viewers[user];
      delete state.streamers[user];
      delete state.viewersWithRaisedHands[user];
      state.totalParticipantCount--;
    });
  }

  addStreamParticipant(participant: Participant) {
    return this.state.update((state) => {
      if (
        !state.viewers[participant.id] &&
        !state.streamers[participant.id] &&
        !state.viewersWithRaisedHands[participant.id]
      ) {
        state.totalParticipantCount++;
      }

      delete state.viewers[participant.id];
      delete state.viewersWithRaisedHands[participant.id];
      delete state.streamers[participant.id];

      if (participant.role === "viewer") {
        state.viewers[participant.id] = participant;
      } else {
        state.streamers[participant.id] = participant;
      }
    });
  }

  private hasStreamingRequestStatusChanged(user: Participant) {
    const { viewersWithRaisedHands } = this.state.get();

    return (
      (user.isRaisingHand && !viewersWithRaisedHands[user.id]) ||
      (!user.isRaisingHand && !!viewersWithRaisedHands[user.id])
    );
  }

  private setStreamingRequestFor(user: Participant) {
    const { viewers, modalCurrent, unseenRaisedHands, viewersWithRaisedHands } =
      this.state.get();

    let updatedViewers = { ...viewers };
    delete updatedViewers[user.id];

    return this.state.update({
      viewers: updatedViewers,
      viewersWithRaisedHands: {
        ...viewersWithRaisedHands,
        [user.id]: user,
      },
      unseenRaisedHands:
        modalCurrent !== "participants"
          ? unseenRaisedHands + 1
          : unseenRaisedHands,
    });
  }

  private cancelStreamingRequestFor(user: Participant) {
    const { viewers, modalCurrent, unseenRaisedHands, viewersWithRaisedHands } =
      this.state.get();

    let updatedViewersWithRaisedHand = { ...viewersWithRaisedHands };
    delete updatedViewersWithRaisedHand[user.id];

    return this.state.update({
      viewers: {
        ...viewers,
        [user.id]: user,
      },
      viewersWithRaisedHands: updatedViewersWithRaisedHand,
      unseenRaisedHands:
        modalCurrent !== "participants" && unseenRaisedHands > 0
          ? unseenRaisedHands - 1
          : unseenRaisedHands,
    });
  }

  async updateStreamParticipant(user: Participant) {
    if (this.hasStreamingRequestStatusChanged(user)) {
      if (user.isRaisingHand) {
        this.setStreamingRequestFor(user);
      } else {
        this.cancelStreamingRequestFor(user);
      }
    }

    return this.state.getStateDiff();
  }

  async leave({
    stream,
    shouldStopStream,
  }: {
    shouldStopStream: boolean;
    stream: string;
  }) {
    const { api } = this.state.get();

    if (stream) {
      if (shouldStopStream) {
        await api.stream.stop(stream);
      } else {
        await api.stream.leave(stream);
      }
    }

    await this.media.close();
    await this.invite.reset();

    return this.state.getStateDiff();
  }

  setNewStreamTitle(title: string) {
    return this.state.update({
      title,
    });
  }

  async join({ stream }: { stream: string }) {
    const { api } = this.state.get();

    const {
      mediaPermissionsToken,
      recvMediaParams,
      streamers,
      raisedHands,
      count,
      host,
      role,
      sendMediaParams,
    } = await api.stream.join(stream);

    console.log("received streamers from api", streamers);

    this.state.update({
      stream,
      currentStreamHost: host,
      totalParticipantCount: count,
      streamers: arrayToMap<Participant>(streamers),
      viewersWithRaisedHands: arrayToMap<Participant>(raisedHands),
      role,
    });

    /** Consume remote audio/video streams */
    await this.media.consumeRemoteStreams({
      stream,
      mediaPermissionsToken,
      recvMediaParams,
      streamers,
    });

    /** If not viewer, start sending media */
    if (role !== "viewer") {
      await this.media.initSendMedia({
        token: mediaPermissionsToken,
        role,
        streamMediaImmediately: false,
        sendMediaParams,
      });
    }

    return this.state.getStateDiff();
  }

  async *create() {
    const { newStreamCategory, api, title, user } = this.state.get();

    yield this.state.update({
      isStartingNewStream: true,
    });

    if (!title || !newStreamCategory) {
      throw new Error("title or category");
    }

    const {
      stream,
      media: sendMediaParams,
      count,
      mediaPermissionsToken,
      recvMediaParams,
    } = await api.stream.create(title, newStreamCategory.id);

    this.state.update({
      stream,
      title,
      sendMediaParams,
      streamers: {
        [user!.id]: {
          ...user!,
          stream,
          role: "streamer",
          isBot: false,
          isBanned: false,
        },
      },
      totalParticipantCount: count,
      currentStreamHost: user!.id,
      role: "streamer",
    });

    await this.media.initMediaConsumer({
      stream,
      mediaPermissionsToken,
      recvMediaParams,
    });

    await this.media.stream({
      token: mediaPermissionsToken,
      kind: "audio",
      streamMediaImmediately: true,
      sendMediaParams,
    });

    await this.media.stream({
      token: mediaPermissionsToken,
      kind: "video",
      streamMediaImmediately: true,
      sendMediaParams,
    });

    yield this.state.update({
      isStartingNewStream: false,
    });
  }

  async reassign(newHostId: string) {
    const { api, modalCloseAfterHostReassign } = this.state.get();

    await api.stream.reassignHost(newHostId);

    if (modalCloseAfterHostReassign) {
      this.modal.close();
    }

    return this.state.getStateDiff();
  }

  updateAudioLevels(levels: any[]) {
    return this.state.update((state) => {
      levels.forEach(({ user, volume }) => {
        state.userAudioLevels[user] = volume;
      });
    });
  }

  delAudioLevel(user: string) {
    return this.state.update((state) => {
      delete state.userAudioLevels[user];
    });
  }
}
