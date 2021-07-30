import EventEmitter from "events";

type PingPong = {
  [key: string]: {
    missedPings: number;
    lastPing: number;
  };
};

const registry: PingPong = {};

export const updatePing = (user: string) => {
  registry[user] = {
    missedPings: 0,
    lastPing: Date.now(),
  };
};

export const observer = new EventEmitter();

export const run = () => {
  setInterval(() => {
    const currentTime = Date.now();

    Object.keys(registry).forEach((user) => {
      const diff = currentTime - registry[user].lastPing;

      if (diff > 5000) {
        registry[user].missedPings++;
      }

      if (registry[user].missedPings >= 3) {
        observer.emit("user-disconnected", user);

        delete registry[user];
      }
    });
  }, 5000);
};
