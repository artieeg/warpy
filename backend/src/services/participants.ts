import { Roles, IParticipant } from "@warpy/lib";
import { MessageService } from ".";
import { User, Participant } from "@backend/models";

export const unsetRaiseHand = async (user: string): Promise<void> => {
  const participant = await Participant.findOne(user);

  participant?.setRaiseHand(true);
};

export const setRaiseHand = async (user: string): Promise<void> => {
  const participant = await Participant.findOne(user);

  participant?.setRaiseHand(false);
};

export const addParticipant = async (
  user: User,
  stream: string,
  role: Roles = "viewer"
): Promise<void> => {
  const participant = Participant.fromUser(user, {
    stream,
    role,
  });

  await participant.save();

  return participant.toJSON();
};

export const setParticipantRole = async (
  stream: string,
  user: string,
  role: Roles
): Promise<void> => {
  const participant = await Participant.findOne(user);

  if (participant?.stream !== stream) {
    return;
  }

  await participant.setRole(role);
};

export const removeParticipant = async (user: string): Promise<void> => {
  const participant = await Participant.findOne({ user: { id: user } });

  console.log("found participant", participant);

  return participant?.remove();
};

export const getStreamParticipants = async (
  streamId: string
): Promise<Participant[]> => {
  return Participant.getByStream(streamId);
};

export const removeAllParticipants = async (
  streamId: string
): Promise<void> => {
  return Participant.deleteAllByStream(streamId);
};

export const getCurrentStreamFor = async (
  user: string
): Promise<string | null> => {
  const participant = await Participant.findOne({ user: { id: user } });

  return participant?.stream;
};

export const setCurrentStreamFor = async (
  id: string,
  stream: string
): Promise<void> => {
  const participant = await Participant.findOne(id);

  await participant?.setStream(stream);
};

export const getRoleFor = async (user: string): Promise<Roles | undefined> => {
  const participant = await Participant.findOne({ user: { id: user } });

  return participant?.role;
};

export const getSpeakers = async (stream: string): Promise<Participant[]> => {
  return Participant.getSpeakers(stream);
};

export const getViewersPage = async (
  stream: string,
  page: number
): Promise<Participant[]> => {
  return Participant.getViewers(stream, page);
};

export const getParticipantsCount = (stream: string): Promise<void> => {
  return Participant.count({ stream });
};

export const getUsersWithRaisedHands = async (
  stream: string
): Promise<Participant[]> => {
  return Participant.getViewersWithRaisedHands(stream);
};

const getParticipantIds = (participants: Participant[]) => {
  return participants.map((p) => p.user.id);
};
