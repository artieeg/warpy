import "reflect-metadata";
import "module-alias/register";

import {
  BroadcastService,
  MessageService,
  StreamService,
  Event,
} from "@backend/services";

import {
  onNewStream,
  onJoinStream,
  onStreamStop,
  onUserDisconnect,
  onViewersRequest,
  onRaiseHand,
  onAllowSpeaker,
  onFeedRequest,
  onWhoAmIRequest,
  onNewUser,
  onActiveSpeakers,
  onUserDelete,
  onNewStreamPreview,
  onNewOnlineNode,
  onReaction,
  onUnfollow,
  onFollow,
  onNewChatMessage,
  onKickUser,
  onUserReport,
  onUserBlock,
  onInvite,
  onInviteSuggestionsRequest,
  onUserSearch,
  onCancelInvite,
  onReadNotifications,
} from "@backend/handlers";
import { withErrorHandling } from "@backend/utils/withErrorHandling";
import { MessageHandler } from "@warpy/lib";

const main = async () => {
  await MessageService.init();
  StreamService.runReactionSync();

  const handlers: Record<Event, MessageHandler<any, any>> = {
    "user-joins-stream": onJoinStream,
    "stream-stop": onStreamStop,
    "stream-new": onNewStream,
    "user-disconnected": onUserDisconnect,
    "viewers-request": onViewersRequest,
    "raise-hand": onRaiseHand,
    "speaker-allow": onAllowSpeaker,
    "feed-request": onFeedRequest,
    "whoami-request": onWhoAmIRequest,
    "new-user": onNewUser,
    "active-speakers": onActiveSpeakers,
    "user-delete": onUserDelete,
    "new-stream-preview": onNewStreamPreview,
    reaction: onReaction,
    "new-media-node": onNewOnlineNode,
    "new-chat-message": onNewChatMessage,
    "kick-user": onKickUser,
    "user-follow": onFollow,
    "user-unfollow": onUnfollow,
    "report-user": onUserReport,
    "block-user": onUserBlock,
    "user-invite": onInvite,
    "invite-suggestions": onInviteSuggestionsRequest,
    "search-user": onUserSearch,
    "cancel-stream-invite": onCancelInvite,
    "read-notifications": onReadNotifications,
  };

  for (const [event, handler] of Object.entries(handlers)) {
    MessageService.on(event, withErrorHandling(handler));
  }

  StreamService.onReactionUpdate(BroadcastService.broadcastReactions);
  console.log(":>");
};

main();
