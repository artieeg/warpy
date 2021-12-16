import { NodeInfo } from "@media/nodeinfo";

const CONNECT_RECV_TRANSPORT = `media.transport.connect.consumer.${NodeInfo.id}`;
const CONSUMER_JOIN_ROOM = `media.peer.join.${NodeInfo.id}`;
const RECV_TRACKS_REQUEST = `media.track.recv.get.${NodeInfo.id}`;
const NEW_PRODUCER = `media.egress.new-producer.${NodeInfo.id}`;

export const ConsumerSubjectEventMap = {
  "media.room.create": "create-room",
  [CONNECT_RECV_TRANSPORT]: "connect-transport",
  [CONSUMER_JOIN_ROOM]: "join-room",
  [RECV_TRACKS_REQUEST]: "recv-tracks-request",
  [NEW_PRODUCER]: "new-producer",
};
