import { InternalError } from "@backend/errors";
import { Prisma, PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

type BaseQueryFn = (...args: any[]) => any;

/**
 * Runs Prisma query, catches Prisma errors, converts them to our errors
 */
export async function runPrismaQuery<F extends BaseQueryFn>(
  fn: F
): Promise<ReturnType<F>> {
  try {
    const result = await fn();

    return result;
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      console.error(e);
      //TODO: handle prisma-specific errors
    }

    throw new InternalError();
  }
}
