/**
 * Keeps track of online producer & consumer media nodes
 * Assigns participants to consumer nodes
 * Currently picks nodes randomly; use ip address in the future
 */

import redis from "redis";
import { INewMediaNode, MediaServiceRole } from "@warpy/lib";

const URL = process.env.MEDIA_SERVER_IDS || "redis://127.0.0.1:6375/6";

const client = redis.createClient({
  url: URL,
});

export const init = async () => {};

const getSetNameFromRole = (role: MediaServiceRole) => {
  return role === "CONSUMER" ? "consumers" : "producers";
};

/**
 * When a new media server node goes online,
 * add it to a corresponding PRODUCER/CONSUMER list
 */
export const handleNewOnlineNode = async (data: INewMediaNode) => {
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

type NodeID = string | null;

/**
 * Returns a producer node id.
 * Currently random
 */
export const getProducerNodeId = async (): Promise<NodeID> => {
  try {
    const producerIds = await getNodeIdsWithRole("PRODUCER");
    return producerIds[Math.floor(Math.random() * producerIds.length)];
  } catch (e) {
    console.error(e);
    return null;
  }
};

/**
 * Returns a consumer node id.
 * Currently random
 */
export const getConsumerNodeId = async () => {
  try {
    const consumerIds = await getNodeIdsWithRole("CONSUMER");
    console.log("consumer node ids", consumerIds);
    return consumerIds[Math.floor(Math.random() * consumerIds.length)];
  } catch (e) {
    console.error(e);
    return null;
  }
};

/**
 * Remember which consumer node the user is connected to.
 */
export const assignUserToNode = async (user: string, node: string) => {
  client.set(`user_${user}`, node);
};

/**
 * Remember which producer node hosts the room
 */
export const assignRoomToNode = async (room: string, node: string) => {
  client.set(`room_${room}`, node);
};
