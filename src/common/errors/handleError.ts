import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export const handleError = (error: unknown) => {
  const nodeEnv = process.env.NODE_ENV || "development";
  if (error instanceof PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        return new Error(
          "Unique constraint failed on the fields " + error.meta?.target
        );
      default:
        return new Error("Something went wrong");
    }
  } else if (error instanceof Error && nodeEnv !== "production") {
    return new Error(error.message);
  } else {
    return new Error("Something went wrong");
  }
};
