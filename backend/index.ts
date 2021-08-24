import "reflect-metadata";
import "module-alias/register";

import { MediaService, MessageService } from "@backend/services";
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
} from "@backend/handlers";

const main = async () => {
  await MessageService.init();

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
  MessageService.on("stream.new_preview", onNewStreamPreview);

  MessageService.on("new-media-node", MediaService.handleNewOnlineNode);
  console.log(":>");
};

main();
