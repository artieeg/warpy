interface IRankParams {
  participants: number;
  claps: number;
  duration: number;
}
export const rank = (params: IRankParams) => {
  /* New streams need to be boosted in the feed.
     This defines time in seconds until the effect starts
     to wear down. */
  const GRACE_PERIOD = 300;

  const MAX_STREAM_DURATION = 86400;

  /* Prefer the amount of participants more than the amount of claps
     in each stream */
  const PARTICIPANTS_OVER_CLAPS = 4;

  const { participants, claps, duration } = params;

  return (
    Math.log10(participants) +
    Math.log10(1 + (PARTICIPANTS_OVER_CLAPS * participants) / claps) +
    participants / duration / MAX_STREAM_DURATION +
    (GRACE_PERIOD - duration) / duration
  );
};
