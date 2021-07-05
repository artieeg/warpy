import { Context, Handler } from "@app/types";
import { jwt } from "@app/utils";

export const onJoinStream: Handler = async (data: any, context?: Context) => {
  const { token, stream_id } = data;

  try {
    const id = jwt.verifyAccessToken(token);

    //TODO: send join event via nats
  } catch (e) {
    console.error(e);

    return;
  }
};
