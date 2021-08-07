import "module-alias/register";

import express from "express";
import routes from "@backend/routes";
import {
  ConversationService,
  DatabaseService,
  MediaService,
  MessageService,
  UserService,
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
  MessageService.on("raise-hand", onRaiseHand);
  MessageService.on("speaker-allow", onAllowSpeaker);
  MessageService.on("feed-request", onFeedRequest);
  MessageService.on("whoami-request", onWhoAmIRequest);

  MessageService.on("new-media-node", MediaService.handleNewOnlineNode);

  /**
   * The handlers down below will be removed when JWT auth for media is implemented.
   * Hence, no refactoring/updates here
   */
  MessageService.on("new-track", ConversationService.handleNewTrack);
  MessageService.on(
    "recv-tracks-request",
    ConversationService.handleRecvTracksRequest
  );
  MessageService.on(
    "connect-transport",
    ConversationService.handleConnectTransport
  );

  app.listen(Number.parseInt(PORT), `0.0.0.0`, () => {
    console.log(`Started on port ${PORT}`);
  });
};

main();
