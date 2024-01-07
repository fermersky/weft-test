import { ZodError } from "zod";
import { AppError } from "./errors.js";

type HttpStatus = 200 | 201 | 400 | 401 | 403 | 500;

type HandleResult<TData> = {
  data?: TData;
  status: HttpStatus;
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
