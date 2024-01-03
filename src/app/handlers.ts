import { ZodError } from "zod";
import { AppError } from "./errors.js";

type HandleResult<TData> = {
  data?: TData;
  status: number;
  error?: unknown;
};

export async function handleErrors<T>(cb: () => Promise<HandleResult<T>>): Promise<HandleResult<T>> {
  try {
    return await cb();
  } catch (error) {
    console.log(error);

    if (error instanceof ZodError) {
      return { error, status: 400 };
    }

    if (error instanceof AppError) {
      return { error: error.message, status: 400 };
    }

    return { status: 500, error: "internal server error" };
  }
}
