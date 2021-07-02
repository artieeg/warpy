import jsonwebtoken from "jsonwebtoken";

const secret = process.env.JWT_SECRET;

if (!secret) {
  throw new Error("no jwt secret");
}

export const createToken = (sub: string, expiresIn: string) => {
  return jsonwebtoken.sign({ sub }, secret, { expiresIn });
};
