export function getMockedInstance<T>(Source: any): jest.Mocked<Partial<T>> {
  let mocked: any = {};
  Object.getOwnPropertyNames(Source.prototype).forEach((key) => {
    mocked[key] = jest.fn();
  });

  return mocked as jest.Mocked<Partial<T>>;
}
