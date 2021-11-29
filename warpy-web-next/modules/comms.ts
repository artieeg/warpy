import { connect, JSONCodec } from "nats";

export const jc = JSONCodec();

export const nats = connect({
  servers: [process.env.NATS],
});

export async function runNATSRequest<Payload = any, Response = any>(
  subject: string,
  payload: Payload
): Promise<Response> {
  const client = await nats;

  const m = jc.encode(payload);

  const reply = await client.request(subject, m, {
    timeout: 1000,
  });

  return jc.decode(reply.data) as Response;
}
