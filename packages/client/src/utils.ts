export function arrayToMap<T = any>(data: any[]): Record<string, T> {
  return data.reduce((p, c) => {
    return {
      ...p,
      [c.id]: c,
    };
  }, []);
}
