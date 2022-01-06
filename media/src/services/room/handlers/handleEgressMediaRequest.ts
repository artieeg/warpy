import { MessageHandler } from "@warpy/lib";

export const handleEgressMediaRequest: MessageHandler<any, any> = async (
  data,
  respond
) => {
  console.log("req data", data);

  respond({ ok: "ok" });
};
