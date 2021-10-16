const producerJoinRoomSubject = `media.peer.join.*`;

export const ProducerSubjectEventMap = {
  "media.track.send": "new-track",
  "media.room.create": "create-room",
  "media.transport.send-transport": "new-speaker",
  "media.egress.try-connect": "new-egress",
  "media.transport.connect.producer": "connect-transport",
  [producerJoinRoomSubject]: "join-room",
};
