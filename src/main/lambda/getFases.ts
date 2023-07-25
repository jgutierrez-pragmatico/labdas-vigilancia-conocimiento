import { APIGatewayProxyResult } from "aws-lambda";
import { dbClient } from "../db/dbClient";
import { errorResponse } from "../responses/errorResponse";
import { FaseEntity } from "../entities/faseEntity";
import { successResponse } from "../responses/successResponse";

export const handler = async (): Promise<APIGatewayProxyResult> => {
  try {
    const result = await dbClient<FaseEntity>("radar_fase")
      .select("*")
      .orderBy("id");

    return successResponse(result);
  } catch (error) {
    console.error({ error });
    return errorResponse(error as Error);
  }
};
