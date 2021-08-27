/**
 * Keeps track of online producer & consumer media nodes
 * Assigns participants to consumer nodes
 * Currently picks nodes randomly; use ip address in the future
 */

import redis from "redis";
import {
  INewMediaNode,
  IMediaPermissions,
  MediaServiceRole,
  IConnectRecvTransportParams,
  INewMediaRoomData,
  INewSpeakerMediaResponse,
} from "@warpy/lib";
import { MessageService } from ".";
import jwt from "jsonwebtoken";

const URL = process.env.MEDIA_SERVER_IDS || "redis://127.0.0.1:6375/6";

const client = redis.createClient({
  url: URL,
});

const getSetNameFromRole = (role: MediaServiceRole) => {
  return role === "CONSUMER" ? "consumers" : "producers";
};

export const createPermissionsToken = (
  permissions: IMediaPermissions
): string => {
  if (!process.env.MEDIA_JWT_SECRET) {
    throw new Error("MEDIA_JWT_SECRET is not set");
  }

  return jwt.sign(permissions, process.env.MEDIA_JWT_SECRET, {
    expiresIn: 60,
  });
};

/**
 * When a new media server node goes online,
 * add it to a corresponding PRODUCER/CONSUMER list
 */
export const handleNewOnlineNode = async (
  data: INewMediaNode
): Promise<void> => {
  const { id, role } = data;

  const setOfNodes = getSetNameFromRole(role);

  client.sadd(setOfNodes, id);
};

const getNodeIdsWithRole = (role: MediaServiceRole) => {
  return new Promise<string[]>((resolve, reject) => {
    const setOfNodes = getSetNameFromRole(role);

    client.smembers(setOfNodes, (err, ids) => {
      if (err) {
        return reject(err);
      }

      resolve(ids);
    });
  });
};

/**
 * Returns a producer node id.
 * Currently random
 */
export const getProducerNodeId = async (): Promise<string> => {
  const producerIds = await getNodeIdsWithRole("PRODUCER");

  if (producerIds.length === 0) {
    throw new Error();
  }

  return producerIds[Math.floor(Math.random() * producerIds.length)];
};

/**
 * Returns a consumer node id.
 * Currently random
 */
export const getConsumerNodeId = async (): Promise<string> => {
  const consumerIds = await getNodeIdsWithRole("CONSUMER");

  if (consumerIds.length === 0) {
    throw new Error();
  }

  return consumerIds[Math.floor(Math.random() * consumerIds.length)];
};

/**
 * Remember which consumer node the user is connected to.
 */
export const assignUserToNode = async (
  user: string,
  node: string
): Promise<void> => {
  client.set(`user_${user}`, node);
};

/**
 * Remember which producer node hosts the room
 */
export const assignRoomToNode = async (
  room: string,
  node: string
): Promise<void> => {
  client.set(`room_${room}`, node);
};

/**
 * Get assigned consumer node for the user
 */
export const getConsumerNodeFor = async (
  user: string
): Promise<string | null> => {
  return new Promise((resolve) => {
    client.get(`user_${user}`, (err, node) => {
      if (err) {
        console.error(err);
        return resolve(null);
      }

      resolve(node);
    });
  });
};

export const createRoom = async (
  host: string,
  roomId: string
): Promise<INewMediaRoomData> => {
  const media = await MessageService.createMediaRoom({
    host: host,
    roomId,
  });

  return media;
};

export const connectSpeakerMedia = async (
  speaker: string,
  stream: string
): Promise<INewSpeakerMediaResponse> => {
  const media = await MessageService.connectSpeakerMedia({
    speaker,
    roomId: stream,
  });

  return media;
};

export const joinRoom = async (
  nodeId: string,
  user: string,
  roomId: string
): Promise<IConnectRecvTransportParams> => {
  const mediaRecvParams = await MessageService.joinMediaRoom(nodeId, {
    user,
    roomId,
  });

  return mediaRecvParams as IConnectRecvTransportParams;
};
