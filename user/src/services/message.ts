import { connect, JSONCodec, NatsConnection } from "nats";
import { UserService } from ".";

const NATS = process.env.NATS_ADDR;
if (!NATS) {
  throw new Error("No nats addr specified");
}

let nc: NatsConnection;

export const init = async () => {
  nc = await connect({ servers: [NATS] });

  handleUserRequests();
};

const handleUserRequests = async () => {
  const sub = nc.subscribe("user.get");

  const jc = JSONCodec();

  for await (const msg of sub) {
    const { id } = jc.decode(msg.data) as any;
    const user = await UserService.getUserById(id);

    const reply = jc.encode(user);
    msg.respond(reply);
  }
};
