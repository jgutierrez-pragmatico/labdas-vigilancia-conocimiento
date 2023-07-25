import { APIGatewayProxyResult } from "aws-lambda";
import { dbClient } from "../db/dbClient";
import { errorResponse } from "../responses/errorResponse";
import { ChapterEntity } from "../entities/chapterEntity";
import { successResponse } from "../responses/successResponse";

export const handler = async (): Promise<APIGatewayProxyResult> => {
  try {
    const result = await dbClient<ChapterEntity>("radar_chapter").select("*");

    return successResponse(result);
  } catch (error) {
    console.error({ error });
    return errorResponse(error as Error);
  }
};
