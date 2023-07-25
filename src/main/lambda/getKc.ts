import { APIGatewayProxyResult } from "aws-lambda";
import { dbClient } from "../db/dbClient";
import { KcEntity } from "../entities/kcEntity";
import { errorResponse } from "../responses/errorResponse";
import { successResponse } from "../responses/successResponse";

export const handler = async (): Promise<APIGatewayProxyResult> => {
  try {
    const result = await dbClient<KcEntity>("radar_kc").select("*");

    return successResponse(result);
  } catch (error) {
    console.error({ error });
    return errorResponse(error as Error);
  }
};
