import jsonwebtoken from "jsonwebtoken";

const secret = process.env.JWT_SECRET || "test-secret";

export const createToken = (sub: string, expiresIn: string): string => {
  return jsonwebtoken.sign({ sub }, secret, { expiresIn });
};

export const verifyAccessToken = (token: string): string => {
  const { sub } = jsonwebtoken.verify(token, secret, {
    ignoreExpiration: true, //TODO: Remove
  });

  return sub as string;
};
