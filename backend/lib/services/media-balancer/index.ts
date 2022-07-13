import { MediaServiceRole } from '@warpy/lib';
import {
  NodeInfoStore,
  NodeRegistryStore,
  StreamNodeAssignerStore,
} from 'lib/stores';

export class MediaBalancerService {
  constructor(
    private nodeRegistryStore: NodeRegistryStore,
    private streamNodeAssigner: StreamNodeAssignerStore,
    private nodeInfoStore: NodeInfoStore,
  ) {}

  /**
   * Returns the best media node to connect to.
   *
   * The goal is to keep stream consumers as "close" as possible.
   * This way, "producer" nodes don't have to fan out their streams to every "consumer" node
   *
   * Currently, we're reusing already assigned nodes if their CPU load is under 80%
   * If there's no such node, we select and assign a new node.
   *
   * When picking a new node, we select the one that has the least load on it.
   * */
  private async selectOptimalNode(stream: string, nodeRole: MediaServiceRole) {
    //Get all available nodes of a requested type
    const allAvailableNodeIds = await this.nodeRegistryStore.getNodeIds(
      nodeRole,
    );

    //Get nodes that are currently assigned to this stream
    const assignedNodeIds = await this.streamNodeAssigner.getAssignedNodes(
      stream,
    );

    //Fetch their info
    const assignedNodesInfo = await Promise.all(
      assignedNodeIds.map((id) => this.nodeInfoStore.get(id)),
    );

    //nodes to select from, filtered by role, sorted by load in descending order
    const candidates = assignedNodesInfo
      .filter((node) => node.role === nodeRole && node.load < 0.8)
      .sort((a, b) => b.load - a.load);

    //If we can reuse a node...
    if (candidates.length > 0) {
      return candidates[0].node;
    }

    //Exclude assigned nodes
    const availableNodeIds = allAvailableNodeIds.filter(
      (id) => !candidates.find((c) => c.node === id),
    );

    if (availableNodeIds.length === 0) {
      return candidates[candidates.length - 1].node;
    }

    //Pick a node with least load
    const { node: id } = (
      await Promise.all(
        availableNodeIds.map((id) => this.nodeInfoStore.get(id)),
      )
    ).sort((a, b) => a.load - b.load)[0];

    await this.streamNodeAssigner.assignNode(stream, id);

    return id;
  }

  async getSendNodeId(stream: string) {
    return this.selectOptimalNode(stream, 'PRODUCER');
  }

  async getRecvNodeId(stream: string) {
    return this.selectOptimalNode(stream, 'CONSUMER');
  }
}
