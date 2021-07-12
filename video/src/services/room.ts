import { ICreateNewRoom, Rooms } from "@app/models";

const rooms: Rooms = {};

export const handleNewRoom = (data: ICreateNewRoom) => {
  const { roomId, host } = data;

  if (rooms[roomId]) {
    return; //TODO
  }
};
