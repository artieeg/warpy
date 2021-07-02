import { connect, NatsConnection, StringCodec } from "nats";
import { UserService } from "./services";

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

  const sc = StringCodec();

  for await (const msg of sub) {
    const { id } = JSON.parse(sc.decode(msg.data));
    const user = await UserService.getUserById(id);

    const reply = sc.encode(JSON.stringify(user));
    msg.respond(reply);
  }
};
