import { Context } from "./types";

export const confirmations: Record<
  string,
  { resolve: () => any; reject: () => any }
> = {};

export const requestConfirmation = (
  confirmation_id: string,
  ctx: Context,
  data: any
) => {
  return new Promise<void>((resolve, reject) => {
    confirmations[confirmation_id] = { resolve, reject };

    ctx.ws.send(JSON.stringify(data));
  });
};
