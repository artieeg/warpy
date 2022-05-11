export const flatten = (data: any) => {
  const args: string[] = [];

  for (const key in data) {
    const value = data[key];

    if (typeof value === 'boolean') {
      args.push(key, value ? 'true' : 'false');
    } else {
      args.push(key, value);
    }
  }

  return args;
};
