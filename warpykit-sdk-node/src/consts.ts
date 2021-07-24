if (!process.env.WARPYKIT_JWT_SECRET) {
  throw new Error("WARPYKIT_JWT_SECRET is not specified");
}

export const JWT_SECRET: string = process.env.WARPYKIT_JWT_SECRET;
