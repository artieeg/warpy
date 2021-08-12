import "module-alias/register";
import dotenv from "dotenv";

dotenv.config();

import { MessageService, RoomService, VideoService } from "@media/services";
import { role } from "@media/role";
import { NodeInfo } from "@media/nodeinfo";
import { AudioLevelObserverVolume } from "mediasoup/lib/AudioLevelObserver";

const main = async () => {
  await Promise.all([MessageService.init(), VideoService.startWorkers()]);

  MessageService.on("create-room", RoomService.handleNewRoom);
  MessageService.on("new-track", RoomService.handleNewTrack);
  MessageService.on("connect-transport", RoomService.handleConnectTransport);
  MessageService.on("join-room", RoomService.handleJoinRoom);
  MessageService.on("recv-tracks-request", RoomService.handleRecvTracksRequest);
  MessageService.on("new-speaker", RoomService.handleNewSpeaker);
  MessageService.on("new-egress", RoomService.handleNewEgress);
  MessageService.on("new-producer", RoomService.handleNewProducer);

  VideoService.getAudioLevelObserver().on(
    "volumes",
    (volumes: AudioLevelObserverVolume[]) => {
      console.log(volumes);
    }
  );

  console.log("Media service has started with role", process.env.ROLE);
  console.log("Media node info", NodeInfo);

  if (role === "PRODUCER") {
    MessageService.sendNodeIsOnlineMessage(NodeInfo);
  } else if (role === "CONSUMER") {
    VideoService.observer.on("pipe-is-ready", () => {
      MessageService.sendNodeIsOnlineMessage(NodeInfo);
    });

    // timeout for dev purposes
    setTimeout(async () => {
      VideoService.tryConnectToIngress();
    }, 1000);
  }
};

main();
