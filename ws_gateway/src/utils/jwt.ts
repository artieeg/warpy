import jsonwebtoken from "jsonwebtoken";

const secret = process.env.JWT_SECRET;

if (!secret) {
  throw new Error("no jwt secret");
}

export const createToken = (sub: string, expiresIn: string) => {
  return jsonwebtoken.sign({ sub }, secret, { expiresIn });
};

export const verifyAccessToken = (token: string) => {
  const { sub, isBot } = jsonwebtoken.verify(token, secret, {
    ignoreExpiration: true, //TODO: Remove
  }) as any;

  return { user: sub, isBot };
};
