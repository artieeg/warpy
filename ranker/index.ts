import "module-alias/register";
import { RankerService, ScoreService } from "@app/services";

const processStream = async (
  id: string,
  currentTime: number,
  hubs: string[]
) => {
  const stats = await ScoreService.getStreamStats(id);

  const rank = RankerService.calculateNewRank({
    participants: stats.participants,
    claps: stats.claps,
    duration: currentTime - stats.started,
  });

  await ScoreService.setNewScore(id, rank, hubs);

  console.log(`new rank for ${id} = ${rank}`);
};

const main = async () => {
  setInterval(async () => {
    const hubs = await ScoreService.getHubs();
    const currentTime = Date.now() / 1000;

    const streams = await ScoreService.getStreamIds();

    const promises = streams.map((id) => processStream(id, currentTime, hubs));

    await Promise.all(promises);
  }, 10000);
};

main();
