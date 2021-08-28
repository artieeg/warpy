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

const secret = process.env.MEDIA_JWT_SECRET || "test-secret";

/**
 * Keeps track of online producer & consumer media nodes
 * Assigns participants to random producer and consumer nodes
 */
export const MediaService = {
  createPermissionsToken(permissions: IMediaPermissions): string {
    return jwt.sign(permissions, secret, {
      expiresIn: 60,
    });
  },

  /**
   * When a new media server node goes online,
   * add it to a corresponding PRODUCER/CONSUMER list
   */
  async addNewNode(nodeId: string, role: MediaServiceRole): Promise<void> {
    const setOfNodes = getSetNameFromRole(role);

    client.sadd(setOfNodes, nodeId);
  },

  async getNodeIdsWithRole(role: MediaServiceRole): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      const setOfNodes = getSetNameFromRole(role);

      client.smembers(setOfNodes, (err, ids) => {
        if (err) {
          return reject(err);
        }

        resolve(ids);
      });
    });
  },

  /**
   * Returns a producer node id.
   * Currently random
   */
  async getProducerNodeId(): Promise<string> {
    const producerIds = await MediaService.getNodeIdsWithRole("PRODUCER");

    if (producerIds.length === 0) {
      throw new Error();
    }

    return producerIds[Math.floor(Math.random() * producerIds.length)];
  },

  /**
   * Returns a consumer node id.
   * Currently random
   */
  async getConsumerNodeId(): Promise<string> {
    const consumerIds = await MediaService.getNodeIdsWithRole("CONSUMER");

    if (consumerIds.length === 0) {
      throw new Error();
    }

    return consumerIds[Math.floor(Math.random() * consumerIds.length)];
  },

  /**
   * Remember which consumer node the user is connected to.
   */
  async assignUserToNode(user: string, node: string): Promise<void> {
    client.set(`user_${user}`, node);
  },

  /**
   * Remember which producer node hosts the room
   */
  async assignRoomToNode(room: string, node: string): Promise<void> {
    client.set(`room_${room}`, node);
  },

  /**
   * Get assigned consumer node for the user
   */
  async getConsumerNodeFor(user: string): Promise<string | null> {
    return new Promise((resolve) => {
      client.get(`user_${user}`, (err, node) => {
        if (err) {
          console.error(err);
          return resolve(null);
        }

        resolve(node);
      });
    });
  },

  async createRoom(host: string, roomId: string): Promise<INewMediaRoomData> {
    const media = await MessageService.createMediaRoom({
      host: host,
      roomId,
    });

    return media;
  },

  async connectSpeakerMedia(
    speaker: string,
    stream: string
  ): Promise<INewSpeakerMediaResponse> {
    const media = await MessageService.connectSpeakerMedia({
      speaker,
      roomId: stream,
    });

    return media;
  },

  async joinRoom(
    nodeId: string,
    user: string,
    roomId: string
  ): Promise<IConnectRecvTransportParams> {
    const mediaRecvParams = await MessageService.joinMediaRoom(nodeId, {
      user,
      roomId,
    });

    return mediaRecvParams as IConnectRecvTransportParams;
  },
};
