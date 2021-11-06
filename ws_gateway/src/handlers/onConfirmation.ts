import { confirmations } from "@ws_gateway/confirmations";
import { Handler } from "@ws_gateway/types";

export const onConfirmation: Handler = async (data) => {
  const { confirmation_id, flag } = data;

  const confirmation = confirmations[confirmation_id];

  if (flag) {
    confirmation.resolve();
  } else {
    confirmation.reject();
  }

  delete confirmations[confirmation_id];
};
