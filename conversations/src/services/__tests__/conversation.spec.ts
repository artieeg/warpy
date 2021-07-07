import { IStream } from "@app/models";
import {
  RoleService,
  ConversationService,
  ParticipantService,
  MessageService,
} from "..";

jest.mock("@app/services/participants");
jest.mock("@app/services/message");
jest.mock("@app/services/role");
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

    expect(ParticipantService.addParticipant).toBeCalledWith(
      stream.owner,
      stream.id
    );

    expect(RoleService.setRole).toBeCalledWith(stream.owner, "streamer");
  });

  it("deletes conversation", async () => {
    const endedStreamId = "stream";

    await ConversationService.handleConversationEnd(endedStreamId);

    expect(ParticipantService.removeAllParticipants).toBeCalledWith(
      endedStreamId
    );
  });

  it("handle participant leave", async () => {
    const user = "test user";
    const stream = "test stream";

    jest
      .spyOn(ParticipantService, "getCurrentStreamFor")
      .mockResolvedValue(stream);

    await ConversationService.handleParticipantLeave(user);
    expect(ParticipantService.getCurrentStreamFor).toBeCalledWith(user);
    expect(ParticipantService.removeParticipant).toBeCalledWith({
      id: user,
      stream,
    });
  });

  it("handles join conversation", async () => {
    const user = "test user";
    const stream = "test stream";

    jest.spyOn(ParticipantService, "addParticipant");
    jest.spyOn(RoleService, "clearRole");
    jest.spyOn(RoleService, "setRole");

    await ConversationService.handleParticipantJoin({
      id: user,
      stream,
      role: "viewer",
    });

    expect(RoleService.clearRole).toBeCalledWith(user);
    expect(RoleService.setRole).toBeCalledWith(user, "viewer");
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
