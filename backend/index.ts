import "reflect-metadata";
import "module-alias/register";

import {
  BroadcastService,
  MessageService,
  StreamService,
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
} from "@backend/handlers";

const main = async () => {
  await MessageService.init();
  StreamService.runReactionSync();

  MessageService.on("user-joins-stream", onJoinStream);
  MessageService.on("stream-stop", onStreamStop);
  MessageService.on("stream-new", onNewStream);
  MessageService.on("user-disconnected", onUserDisconnect);
  MessageService.on("viewers-request", onViewersRequest);
  MessageService.on("raise-hand", onRaiseHand);
  MessageService.on("speaker-allow", onAllowSpeaker);
  MessageService.on("feed-request", onFeedRequest);
  MessageService.on("whoami-request", onWhoAmIRequest);
  MessageService.on("new-user", onNewUser);
  MessageService.on("active-speakers", onActiveSpeakers);
  MessageService.on("user-delete", onUserDelete);
  MessageService.on("new-stream-preview", onNewStreamPreview);
  MessageService.on("reaction", onReaction);
  MessageService.on("new-media-node", onNewOnlineNode);

  StreamService.onReactionUpdate(BroadcastService.broadcastReactions);
  console.log(":>");
};

main();
