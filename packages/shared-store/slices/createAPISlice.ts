import { GetState, SetState } from "zustand";
import { APIClient, WebSocketConn } from "@warpy/api";
import { IStore } from "../useStore";
import produce from "immer";

type APISubscriptionParams = {
  onStreamIdAvailable: (id: string) => void;
};

export interface IAPISlice {
  api: APIClient;
  connect: (addr: string) => void;
  createAPISubscriptions: (params: APISubscriptionParams) => void;
}

let reconnecting_interval: any;

export const createAPISlice = (
  set: SetState<IStore>,
  get: GetState<IStore>
): IAPISlice => ({
  api: APIClient(new WebSocketConn()),
  connect: async (addr) => {
    return new Promise((resolve) => {
      const socket = new WebSocket(addr);

      socket.onopen = () => {
        get().api.conn.socket = socket;

        clearInterval(reconnecting_interval);

        socket.onclose = () => {
          clearInterval(reconnecting_interval);

          reconnecting_interval = setInterval(() => {
            console.log("reconnecting...");

            get().connect(addr);
          }, 1000);
        };

        socket.onerror = () => {
          socket.close();
        };

        resolve();
      };
    });
  },
  createAPISubscriptions: ({ onStreamIdAvailable }) => {
    const store = get();
    const { api } = store;

    api.awards.onNewAward(({ award }) => {
      get().dispatchAwardDisplayQueueAppend(award);
    });

    api.stream.onInviteStateUpdate((data) => {
      get().dispatchInviteStateUpdate(data.id, data.state);
    });

    api.stream.onPreviousStream((data) => {
      console.log("previous stream", data);

      set({
        previousStreamId: data.stream,
      });
    });

    api.stream.onStreamIdAvailable(({ id }) => {
      setTimeout(() => {
        if (get().modalCurrent === "stream-invite") {
          set(
            produce<IStore>((state) => {
              if (state.modalInvite?.stream) {
                state.modalInvite.stream.id = id;
              } else if (state.modalInvite) {
                state.modalInvite.stream = { id } as any; //🤡
              }
            })
          );
        } else {
          onStreamIdAvailable(id);
        }
      }, 1500);
    });

    api.stream.onNewParticipant((data) => {
      store.dispatchParticipantAdd(data.participant);
    });

    api.stream.onActiveSpeaker((data) => {
      store.dispatchAudioLevelsUpdate(data.speakers);
    });

    api.stream.onRaiseHandUpdate((data) => {
      const participant = data.viewer;
      store.dispatchParticipantRaisedHand(participant);
    });

    api.stream.onRoleUpdate(async ({ mediaPermissionToken, media, role }) => {
      await get().dispatchUserRoleUpdate(role, mediaPermissionToken, media);
    });

    api.stream.onMediaToggle((data) => {
      get().dispatchMediaToggle(data.user, {
        video: data.videoEnabled,
        audio: data.audioEnabled,
      });
      console.log(`${data.user} toggled media`, data);
    });

    api.botDev.onCreateBotConfirmRequest(({ confirmation_id, bot }) => {
      get().dispatchModalOpen("bot-confirm", {
        botConfirmData: bot,
        botConfirmId: confirmation_id,
      });
    });

    api.media.onNewTrack(async (data) => {
      const { mediaClient, recvTransport } = get();

      console.log("new track");
      console.log({ data, mediaClient, recvTransport });

      if (mediaClient && recvTransport) {
        const consumer = await mediaClient.consumeRemoteStream(
          data.consumerParameters,
          data.user,
          recvTransport
        );

        const track = new MediaStream([consumer.track]);

        const key = consumer.kind === "audio" ? "audioTracks" : "videoTracks";

        set({
          [key]: [...get()[key], track],
          streamers: {
            ...get().streamers,
            [data.user]: {
              ...get().streamers[data.user],
              media: {
                ...get().streamers[data.user],
                [consumer.kind]: {
                  consumer,
                  track,
                },
              } as any,
            },
          },
        } as any);

        /*
        set(
          produce<IStore>((state) => {
            state.streamers = {
              ...state.streamers,
              [data.user]: {
                ...state.streamers[data.user],
                media: {
                  ...state.streamers[data.user],
                  [consumer.kind]: {
                    consumer,
                    track: new MediaStream([consumer.track]),
                  },
                } as any,
              },
            };

            /*
            state.streamers[data.user] = {
              ...state.streamers[data.user],
              media: {
                ...state.streamers[data.user],
                [consumer.kind]: {
                  consumer,
                  track: new MediaStream([consumer.track]),
                },
              } as any,
            };
          })
        );
*/
      }
    });

    api.stream.onParticipantRoleChange((data) => {
      const { user } = data;

      store.dispatchStreamerAdd(user);
    });

    api.stream.onUserLeft((data) => {
      const { user } = data;

      store.dispatchParticipantRemove(user);
    });

    api.stream.onChatMessages((data) => {
      const { messages } = data;

      store.dispatchChatMessages(messages);
    });

    api.stream.onUserKick(({ user }) => {
      store.dispatchParticipantRemove(user);
    });

    api.notification.onNewNotification((data) => {
      get().dispatchNotificationAdd(data.notification);
    });

    api.notification.onNotificationDelete((data) => {
      get().dispatchNotificationRemove(data.notification_id);
    });
  },
});
