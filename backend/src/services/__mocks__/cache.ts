export const CacheService = {
  withCache: (fn: any, _params: any) => {
    console.log("called withCache");
    return fn;
  },
};
