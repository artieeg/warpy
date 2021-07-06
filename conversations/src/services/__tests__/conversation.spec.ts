import { IStream } from "@app/models";
import * as ConversationService from "../conversation";
import * as Participants from "../participants";

jest.mock("@app/services/participants");
jest.spyOn(Participants, "addParticipant");
jest.spyOn(Participants, "removeAllParticipants");
jest.spyOn(Participants, "removeParticipant");
jest.spyOn(Participants, "getCurrentStreamFor");

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

    expect(Participants.addParticipant).toBeCalledWith({
      stream: stream.id,
      id: stream.owner,
    });
  });

  it("deletes conversation", async () => {
    const endedStreamId = "stream";

    await ConversationService.handleConversationEnd(endedStreamId);

    expect(Participants.removeAllParticipants).toBeCalledWith(endedStreamId);
  });

  it("handle participant leave", async () => {
    const user = "test user";
    const stream = "test stream";

    jest.spyOn(Participants, "getCurrentStreamFor").mockResolvedValue(stream);

    await ConversationService.handleParticipantLeft(user);
    expect(Participants.getCurrentStreamFor).toBeCalledWith(user);
    expect(Participants.removeParticipant).toBeCalledWith({
      id: user,
      stream,
    });
  });

  it.todo("handles raised hand event");
  it.todo("handles allow speaker event");
  it.todo("handles published track event");
});
