import "module-alias/register";

import express from "express";
import routes from "@backend/routes";
import {
  ConversationService,
  DatabaseService,
  FeedsCacheService,
  FeedService,
  MediaService,
  MessageService,
  ParticipantService,
  UserService,
} from "@backend/services";
import {
  onNewStream,
  onJoinStream,
  onStreamStop,
  onUserDisconnect,
  onViewersRequest,
} from "@backend/handlers";

const app = express();
app.use(express.json());
app.use(routes);

const PORT = process.env.PORT;

if (!PORT) {
  throw new Error("No port specified");
}
const main = async () => {
  await DatabaseService.connect();
  await MessageService.init();

  MessageService.on("user-joins-stream", onJoinStream);
  MessageService.on("stream-stop", onStreamStop);
  MessageService.on("stream-new", onNewStream);
  MessageService.on("user-disconnected", onUserDisconnect);
  MessageService.on("viewers-request", onViewersRequest);

  MessageService.on("new-track", ConversationService.handleNewTrack);
  MessageService.on("raise-hand", ConversationService.handleRaisedHand);
  MessageService.on("speaker-allow", ConversationService.handleAllowSpeaker);
  MessageService.on(
    "recv-tracks-request",
    ConversationService.handleRecvTracksRequest
  );
  MessageService.on("new-media-node", MediaService.handleNewOnlineNode);
  MessageService.on(
    "connect-transport",
    ConversationService.handleConnectTransport
  );
  MessageService.on("whoami-request", UserService.onWhoAmIRequest);
  MessageService.on("feed-request", FeedService.onFeedRequest);

  app.listen(Number.parseInt(PORT), `0.0.0.0`, () => {
    console.log(`Started on port ${PORT}`);
  });
};

main();
