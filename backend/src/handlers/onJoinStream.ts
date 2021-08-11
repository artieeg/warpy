import {
  MediaService,
  ParticipantService,
  UserService,
} from "@backend/services";
import { IJoinStreamResponse, IJoinStream, MessageHandler } from "@warpy/lib";

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

    const participant = await ParticipantService.addParticipant(
      userData,
      stream
    );

    await Promise.all([
      MediaService.assignUserToNode(user, recvNodeId),
      ParticipantService.setCurrentStreamFor(user, stream),
    ]);

    await Promise.all([
      ParticipantService.broadcastNewViewer(participant),
      MediaService.joinRoom(recvNodeId, user, stream),
    ]);

    const [speakers, raisedHands, count] = await Promise.all([
      ParticipantService.getSpeakers(stream),
      ParticipantService.getUsersWithRaisedHands(stream),
      ParticipantService.getParticipantsCount(stream),
    ]);

    console.log(
      "speakares",
      speakers.map((i) => i.toJSON())
    );

    const mediaPermissionsToken = MediaService.createPermissionsToken({
      room: stream,
      audio: false,
      video: false,
      recvNodeId,
    });

    respond({
      speakers: speakers.map((i) => i.toJSON()),
      raisedHands: raisedHands.map((i) => i.toJSON()),
      count,
      mediaPermissionsToken,
    });
  };
