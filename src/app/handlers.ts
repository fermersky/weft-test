import { ZodError } from "zod";
import { AppError } from "./errors.js";

export async function handleErrors(
  cb: () => Promise<{ data: unknown; status: number; error?: unknown }>
): Promise<{ data: unknown; status: number; error?: unknown }> {
  try {
    return await cb();
  } catch (error) {
    console.log(error);

    if (error instanceof ZodError) {
      return { data: null, error: error, status: 400 };
    }

    if (error instanceof AppError) {
      return { data: null, error: error.message, status: 400 };
    }

    return { data: null, status: 500, error: "internal server error" };
  }
}
