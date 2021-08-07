import {
  MediaService,
  ParticipantService,
  UserService,
} from "@backend/services";
import {
  IJoinStreamResponse,
  IJoinStream,
  MessageHandler,
  Participant,
} from "@warpy/lib";

export const onJoinStream: MessageHandler<IJoinStream, IJoinStreamResponse> =
  async (data, respond) => {
    const { stream, user } = data;

    const [userData, recvNodeId] = await Promise.all([
      UserService.getUserById(user),
      MediaService.getConsumerNodeId(),
    ]);

    if (!userData || !recvNodeId) {
      return;
    }

    await Promise.all([
      MediaService.assignUserToNode(user, recvNodeId),
      ParticipantService.addParticipant(user, stream),
      ParticipantService.setCurrentStreamFor(user, stream),
    ]);

    await Promise.all([
      ParticipantService.broadcastNewViewer(
        Participant.fromUser(userData, "viewer", stream)
      ),
      MediaService.joinRoom(recvNodeId, user, stream),
    ]);

    const [speakers, raisedHands, count] = await Promise.all([
      ParticipantService.getSpeakers(stream),
      ParticipantService.getUsersWithRaisedHands(stream),
      ParticipantService.getParticipantsCount(stream),
    ]);

    respond({
      speakers,
      raisedHands,
      count,
    });
  };
