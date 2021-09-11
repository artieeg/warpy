export function arrayToMap<T>(array: T[]) {
  const result: Record<string, T> = {};
  array.forEach(item => {
    result[(item as any).id] = item;
  });

  return result;
}
