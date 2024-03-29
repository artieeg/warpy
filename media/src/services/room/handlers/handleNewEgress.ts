import { NodeInfo } from "@media/nodeinfo";
import { SFUService } from "@media/services";
import { MessageHandler, RequestConnectMediaServer } from "@warpy/lib";
import util from "util";

export const handleNewEgress: MessageHandler<
  RequestConnectMediaServer,
  RequestConnectMediaServer
> = async (data, respond) => {
  const { ip, port, srtp, node } = data;

  const localPipeTransport = await SFUService.createPipeTransport();
  await localPipeTransport.connect({ ip, port, srtpParameters: srtp });

  const { localIp, localPort } = localPipeTransport.tuple;
  const { srtpParameters } = localPipeTransport;

  console.log("INGRESS PIPE TRANSPORT TUPLE");
  console.log(localPipeTransport.tuple);

  SFUService.egressPipes[node] = localPipeTransport;

  console.log("current pipes");
  console.log(util.inspect(SFUService.egressPipes, { depth: 0 }));

  respond!({
    node: NodeInfo.id,
    ip: localIp!,
    port: localPort!,
    srtp: srtpParameters,
  });
};
