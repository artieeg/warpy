import { jwt } from "@app/utils";

export const onJoinStream = async (data: any) => {
  const { token, stream_id } = data;

  try {
    const id = jwt.verifyAccessToken(token);

    //TODO: send join event via nats
  } catch (e) {
    console.error(e);

    return;
  }
};
