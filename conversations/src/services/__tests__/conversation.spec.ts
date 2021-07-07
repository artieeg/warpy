import { IStream } from "@app/models";
import { ConversationService, ParticipantService, MessageService } from "..";

jest.mock("@app/services/participants");
jest.mock("@app/services/message");
jest.spyOn(ParticipantService, "addParticipant");
jest.spyOn(ParticipantService, "removeAllParticipants");
jest.spyOn(ParticipantService, "removeParticipant");
jest.spyOn(ParticipantService, "getCurrentStreamFor");

describe("conversation service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("handles new converation", async () => {
    const stream: IStream = {
      id: "stream-id",
      owner: "owner-id",
    };

    await ConversationService.handleNewConversation(stream);

    expect(ParticipantService.addParticipant).toBeCalledWith({
      id: stream.owner,
      stream: stream.id,
      role: "streamer",
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

  it.todo("handles raised hand event");
  it.todo("handles allow speaker event");
  it.todo("handles published track event");
});
