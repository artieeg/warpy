import { ConsumerType, RtpParameters } from "mediasoup/lib/types";

export interface Consumer {
  user: string;
  consumerParameters: {
    producerId: string;
    id: string;
    kind: string;
    rtpParameters: RtpParameters;
    type: ConsumerType;
    producerPaused: boolean;
  };
}
