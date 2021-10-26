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
    node: {
      isOnline: "media.node.is-online",
    },
    egress: {
      tryConnect: "media.egress.try-connect",
      pipeIsReady: "media.egress.pipe-is-ready",
      newProducer: "media.egress.new-producer",
    },
    room: {
      create: "media.room.create",
    },
    peer: {
      makeSpeaker: "media.transport.send-transport",
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
