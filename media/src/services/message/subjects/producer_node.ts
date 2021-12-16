import { NodeInfo } from "@media/nodeinfo";

const producerJoinRoomSubject = `media.peer.join.*`;
const removeUserProducers = `media.peer.remove-producers.${NodeInfo.id}`;

export const ProducerSubjectEventMap = {
  "media.track.send": "new-track",
  "media.room.create": "create-room",
  "media.transport.send-transport": "new-speaker",
  "media.egress.try-connect": "new-egress",
  "media.transport.connect.producer": "connect-transport",
  //[producerJoinRoomSubject]: "join-room",
  [removeUserProducers]: "remove-user-producers",
};
