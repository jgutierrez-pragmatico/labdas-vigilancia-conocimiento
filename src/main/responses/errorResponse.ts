import { ZodError } from "zod";
import { NotFoundError } from "./NotFoundError";

export const errorResponse = (error: Error) => {
  if (error instanceof ZodError) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "error",
        errors: error.issues.map((issue) => {
          return {
            code: issue.code,
            message: issue.message,
            property: issue.path.length > 1 ? issue.path[1] : issue.path[0],
          };
        }),
      }),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
    };
  }

  if (error instanceof NotFoundError) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        statusCode: 404,
        message: error.message,
      }),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
    };
  }

  return {
    statusCode: 500,
    body: JSON.stringify({
      statusCode: 500,
      message: "Internal Server Error",
    }),
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
  };
};
