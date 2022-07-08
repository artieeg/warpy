import { GetState, SetState } from "zustand";
import { APIClient, WebSocketConn } from "@warpy/api";
import { IStore } from "../useStore";
import produce from "immer";

type APISubscriptionParams = {
  onStreamIdAvailable: (id: string) => void;
  onStreamEnd: (id: string) => void;
};

export interface IAPISlice {
  api: APIClient;
  isConnected: boolean;
  connect: (addr: string) => void;
  createAPISubscriptions: (params: APISubscriptionParams) => void;
}

let reconnecting_interval: any;

export const createAPISlice = (
  set: SetState<IStore>,
  get: GetState<IStore>
): IAPISlice => ({
  api: APIClient(new WebSocketConn()),
  isConnected: false,
  connect: async (addr) => {
    return new Promise((resolve) => {
      const socket = new WebSocket(addr);

      socket.onclose = () => {
        clearInterval(reconnecting_interval);

        set({ isConnected: false });
        reconnecting_interval = setInterval(() => {
          console.log("reconnecting...");

          get().connect(addr);
        }, 1000);
      };

      socket.onerror = () => {
        console.log("error");
        socket.close();
      };

      socket.onopen = () => {
        get().api.conn.socket = socket;
        set({ isConnected: true });

        clearInterval(reconnecting_interval);

        resolve();
      };
    });
  },
  createAPISubscriptions: ({ onStreamIdAvailable, onStreamEnd }) => {
    const { api, dispatch } = get();

    api.awards.onNewAward(({ award }) => {
      get().dispatchAwardDisplayQueueAppend(award);
    });

    api.stream.onInviteStateUpdate((data) => {
      dispatch(({ invite }) =>
        invite.updateStateOfSentInvite(data.id, data.state)
      );
    });

    api.stream.onHostReassign(({ host }) => {
      if (get().user?.id === host.id) {
        dispatch(({ toast }) =>
          toast.showToastMessage("you are a new stream host")
        );
      } else {
        dispatch(({ toast }) =>
          toast.showToastMessage(`${host.username} is a new stream host`)
        );
      }

      set({
        currentStreamHost: host.id,
      });
    });

    api.stream.onPreviousStream((data) => {
      set({
        previousStreamData: data.stream,
      });
    });

    api.stream.onStreamEnd(({ stream }) => {
      onStreamEnd(stream);
      dispatch(({ toast }) => toast.showToastMessage("the stream has ended"));

      set({
        feed: get().feed.filter((candidate) => candidate.id !== stream),
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
      dispatch(({ stream }) => stream.addStreamParticipant(data.participant));
    });

    api.stream.onActiveSpeaker((data) => {
      dispatch(({ stream }) => stream.updateAudioLevels(data.speakers));
    });

    api.stream.onRaiseHandUpdate((data) => {
      dispatch(({ stream }) => stream.updateStreamParticipant(data.viewer));
    });

    api.stream.onRoleUpdate(
      async ({ mediaPermissionToken, sendMediaParams, role }) => {
        dispatch(({ user }) =>
          user.updateUserRole({
            role,
            mediaPermissionToken,
            sendMediaParams,
          })
        );
      }
    );

    api.stream.onMediaToggle((data) => {
      dispatch(({ media }) =>
        media.toggleParticipantMedia(data.user, {
          video: data.videoEnabled,
          audio: data.audioEnabled,
        })
      );
    });

    api.botDev.onCreateBotConfirmRequest(({ confirmation_id, bot }) => {
      dispatch(({ modal }) =>
        modal.open("bot-confirm", {
          botConfirmData: bot,
          botConfirmId: confirmation_id,
        })
      );
    });

    api.media.onNewTrack((data) => {
      dispatch(({ media }) =>
        media.consumeRemoteStream({
          user: data.user,
          consumerParameters: data.consumerParameters,
          startConsumingImmediately: false,
        })
      );
    });

    api.stream.onParticipantRoleChange((data) => {
      dispatch(({ stream }) => stream.addStreamParticipant(data.user));
    });

    api.stream.onUserLeft((data) => {
      dispatch(({ stream }) => stream.removeStreamParticipant(data.user));
    });

    api.stream.onChatMessages((data) => {
      dispatch(({ chat }) => chat.prependNewMessages(data.messages));
    });

    api.stream.onUserKick(({ user }) => {
      dispatch(({ stream }) => stream.removeStreamParticipant(user));
    });

    api.stream.onNewInvite(({ invite }) => {
      dispatch(({ modal }) => modal.open("stream-invite", { invite }));
    });

    api.notification.onNewNotification((data) => {
      dispatch(({ notification }) =>
        notification.addNewNotification(data.notification)
      );
    });

    api.notification.onNotificationDelete((data) => {
      dispatch(({ notification }) => notification.remove(data.notification_id));
    });
  },
});
