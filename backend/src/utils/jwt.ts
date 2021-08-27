import jsonwebtoken from "jsonwebtoken";

const secret = process.env.JWT_SECRET;

if (!secret) {
  throw new Error("no jwt secret");
}

export const createToken = (sub: string, expiresIn: string): string => {
  return jsonwebtoken.sign({ sub }, secret, { expiresIn });
};

export const verifyAccessToken = (token: string): string => {
  const { sub } = jsonwebtoken.verify(token, secret, {
    ignoreExpiration: true, //TODO: Remove
  });

  return sub as string;
};
