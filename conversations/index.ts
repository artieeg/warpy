import "module-alias/register";

import {
  ConversationService,
  MediaService,
  MessageService,
  ParticipantService,
} from "@conv/services";
import "module-alias/register";

const main = async () => {
  await Promise.all([
    MessageService.init(),
    ParticipantService.init(),
    MediaService.init(),
  ]);

  MessageService.on(
    "conversation-new",
    ConversationService.handleNewConversation
  );
  MessageService.on(
    "conversation-end",
    ConversationService.handleConversationEnd
  );
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

  console.log("Conversations Service started");
};

main();
