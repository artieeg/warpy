import "module-alias/register";

import express from "express";
import routes from "@app/routes";
import {
  ConversationService,
  DatabaseService,
  FeedService,
  MediaService,
  MessageService,
  ParticipantService,
  StreamService,
} from "@app/services";
import { IStream } from "@app/models";

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

  StreamService.observer.on("stream-new", (stream: IStream) => {
    FeedService.onNewCandidate(stream);
  });

  StreamService.observer.on("stream-new", (stream: IStream) => {
    ConversationService.handleNewConversation({
      id: stream.id.toString(),
      owner: stream.owner.toString(),
    });
  });

  StreamService.observer.on("stream-ended", (id: string) => {
    FeedService.onRemoveCandidate(id);
  });

  StreamService.observer.on("stream-ended", (id: string) => {
    ConversationService.handleConversationEnd(id);
  });

  StreamService.observer.on("stream-ended", (id: string) => {
    ParticipantService.removeAllParticipants(id);
  });

  MessageService.on(
    "participant-new",
    ConversationService.handleParticipantJoin
  );
  MessageService.on(
    "participant-leave",
    ConversationService.handleParticipantLeave
  );
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

  MessageService.on("viewers-request", ParticipantService.handleViewersRequest);
  MessageService.on("stream-stop", StreamService.stopStream);

  app.listen(Number.parseInt(PORT), `0.0.0.0`, () => {
    console.log(`Started on port ${PORT}`);
  });
};

main();
