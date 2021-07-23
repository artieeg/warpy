import "module-alias/register";
import dotenv from "dotenv";

dotenv.config();

import { MessageService, RoomService, VideoService } from "@video/services";
import { role } from "@video/role";

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

  console.log("Media service has started with role", process.env.ROLE);

  if (role === "PRODUCER") {
    return;
  }

  //timeout for dev purposes
  setTimeout(async () => {
    RoomService.tryConnectToIngress();
  }, 1000);
};

main();
