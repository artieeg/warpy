import { NodeInfo } from "@media/nodeinfo";

const connectRecvTransportSubject = `media.transport.connect.consumer.${NodeInfo.id}`;
const consumerJoinRoomSubject = `media.peer.join.${NodeInfo.id}`;

const recvTracksRequestSubject = `media.track.recv.get.${NodeInfo.id}`;
const newProducerSubject = `media.egress.new-producer.${NodeInfo.id}`;

export const ConsumerSubjectEventMap = {
  "media.room.create": "create-room",
  [connectRecvTransportSubject]: "connect-transport",
  [consumerJoinRoomSubject]: "join-room",
  [recvTracksRequestSubject]: "recv-tracks-request",
  [newProducerSubject]: "new-producer",
};
