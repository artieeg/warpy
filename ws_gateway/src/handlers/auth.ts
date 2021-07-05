import { Handler } from "@app/types";
import { jwt } from "@app/utils";

export const onAuth: Handler = async (data, context) => {
  const { token } = data;
  const user = jwt.verifyAccessToken(token);

  context!.user = user;
};
