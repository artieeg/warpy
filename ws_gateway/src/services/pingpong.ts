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

export const runPingPong = (interval: number) => {
  setInterval(() => {
    const currentTime = Date.now();

    Object.keys(registry).forEach((key) => {
      const diff = currentTime - registry[key].lastPing;

      if (diff > 5000) {
        registry[key].missedPings++;
      }

      if (registry[key].missedPings >= 3) {
        //TODO: handle user disconnect
      }
    });
  }, interval);
};
