import { IStream } from "@conv/models";
import { createNewMediaRoomDataFixture } from "@warpy/lib";
import { ConversationService, ParticipantService, MessageService } from "..";

jest.mock("@conv/services/participants");
jest.mock("@conv/services/message");
jest.spyOn(ParticipantService, "addParticipant");
jest.spyOn(ParticipantService, "removeAllParticipants");
jest.spyOn(ParticipantService, "removeParticipant");
jest.spyOn(ParticipantService, "getCurrentStreamFor");

describe("conversation service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("handles new converation", async () => {
    const media = createNewMediaRoomDataFixture();

    jest.spyOn(MessageService, "createMediaRoom").mockResolvedValue(media);

    const stream: IStream = {
      id: "stream-id",
      owner: "owner-id",
    };

    await ConversationService.handleNewConversation(stream);

    expect(MessageService.createMediaRoom).toBeCalledWith({
      roomId: stream.id,
      host: stream.owner,
    });

    expect(ParticipantService.addParticipant).toBeCalledWith({
      id: stream.owner,
      stream: stream.id,
      role: "streamer",
    });

    expect(MessageService.sendMessage).toBeCalledWith(stream.owner, {
      event: "created-room",
      data: {
        media,
      },
    });
  });

  it("deletes conversation", async () => {
    const endedStreamId = "stream";

    await ConversationService.handleConversationEnd(endedStreamId);

    expect(ParticipantService.removeAllParticipants).toBeCalledWith(
      endedStreamId
    );

    expect(MessageService.sendMessageBroadcast).toBeCalled();
  });

  it("handles participant leave", async () => {
    const user = "test user";
    const stream = "test stream";

    jest
      .spyOn(ParticipantService, "getCurrentStreamFor")
      .mockResolvedValue(stream);

    await ConversationService.handleParticipantLeave(user);
    expect(ParticipantService.getCurrentStreamFor).toBeCalledWith(user);
    expect(ParticipantService.getStreamParticipants).toBeCalledWith(stream);
    expect(ParticipantService.removeParticipant).toBeCalledWith({
      id: user,
      stream,
    });

    expect(MessageService.sendMessageBroadcast).toBeCalled();
  });

  it("handles participant join", async () => {
    const user = "test user";
    const stream = "test stream";

    jest.spyOn(ParticipantService, "addParticipant");

    await ConversationService.handleParticipantJoin({
      id: user,
      stream,
      role: "viewer",
    });

    expect(ParticipantService.setCurrentStreamFor).toBeCalledWith({
      id: user,
      stream,
      role: expect.anything(),
    });

    expect(ParticipantService.addParticipant).toBeCalledWith({
      id: user,
      stream,
      role: "viewer",
    });

    expect(MessageService.sendMessageBroadcast).toBeCalled();
  });

  it("handles raised hand event", async () => {
    const user = "test user";
    const stream = "test stream";

    const participants = ["owner", "user1", "user2", user];

    jest
      .spyOn(ParticipantService, "getStreamParticipants")
      .mockResolvedValue(participants);

    jest
      .spyOn(ParticipantService, "getCurrentStreamFor")
      .mockResolvedValue(stream);

    await ConversationService.handleRaisedHand(user);

    expect(MessageService.sendMessageBroadcast).toBeCalledWith(participants, {
      event: "raise-hand",
      data: {
        user,
        stream,
      },
    });
  });

  it("handles allow speaker event", async () => {
    const user = "test user";
    const speaker = "test speaker";
    const stream = "test stream";

    const media = { sendTransportOptions: {} } as any;

    const participants = [user, speaker, "user1", "user2"];
    const participantsToBroadcast = participants.filter((p) => p !== speaker);

    jest.spyOn(MessageService, "connectSpeakerMedia").mockResolvedValue(media);
    jest
      .spyOn(ParticipantService, "getCurrentStreamFor")
      .mockResolvedValue(stream);
    jest
      .spyOn(ParticipantService, "getStreamParticipants")
      .mockResolvedValue(participants);

    await ConversationService.handleAllowSpeaker({ user, speaker });

    expect(MessageService.sendMessage).toBeCalledWith(speaker, {
      event: "speaking-allowed",
      data: {
        stream,
      },
    });

    expect(MessageService.sendMessageBroadcast).toBeCalledWith(
      participantsToBroadcast,
      {
        event: "allow-speaker",
        data: {
          speaker,
          stream,
          media,
        },
      }
    );
  });

  it("handles published track event", async () => {
    const user = "test user";
    const track = "test track";
    const stream = "test stream";

    const participants = ["owner", "user1", "user2", user];
    const participantsToBroadcast = participants.filter((p) => p !== user);

    jest
      .spyOn(ParticipantService, "getCurrentStreamFor")
      .mockResolvedValue(stream);
    jest
      .spyOn(ParticipantService, "getStreamParticipants")
      .mockResolvedValue(participants);

    jest.spyOn(ParticipantService, "getRoleFor").mockResolvedValue("speaker");

    await ConversationService.handleNewTrack({ user, track });

    expect(MessageService.sendMessageBroadcast).toBeCalledWith(
      participantsToBroadcast,
      {
        event: "track-new",
        data: {
          user,
          track,
          stream,
        },
      }
    );
  });

  it("does not publish tracks if viewer", async () => {
    const user = "test user";
    const track = "test track";
    const stream = "test stream";

    const participants = ["owner", "user1", "user2", user];

    jest
      .spyOn(ParticipantService, "getCurrentStreamFor")
      .mockResolvedValue(stream);
    jest
      .spyOn(ParticipantService, "getStreamParticipants")
      .mockResolvedValue(participants);

    jest.spyOn(ParticipantService, "getRoleFor").mockResolvedValue("viewer");

    await ConversationService.handleNewTrack({ user, track });

    expect(MessageService.sendMessageBroadcast).toBeCalledTimes(0);
  });
});
