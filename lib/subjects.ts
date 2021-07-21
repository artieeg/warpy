export const subjects = {
  conversations: {
    transport: {
      try_connect: "conversations.transport.try_connect",
    },
    track: {
      try_send: "conversations.track.try_send",
      try_get: "conversations.track.try_get",
    },
  },
  media: {
    room: {
      create: "media.room.create",
    },
    peer: {
      makeSpeaker: "media.peer.make-speaker",
      join: "media.peer.join",
    },
    transport: {
      connect: "media.transport.connect",
      connect_producer: "media.transport.connect.producer",
      connect_consumer: "media.transport.connect.consumer",
    },
    track: {
      send: "media.track.send",
      getRecv: "media.track.recv.get",
    },
  },
};
