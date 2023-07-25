import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { errorResponse } from "../responses/errorResponse";
import { successResponse } from "../responses/successResponse";
import { formatRadar } from "../utils/formatRadar";
import { MySqlEntriesRepository } from "../repositories/mySqlEntriesRepository";
import { getEntriesSchema } from "../dto/getEntriesDTO";

interface QueryParams {
  format: string;
}

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const params = event.queryStringParameters as unknown as QueryParams;

    getEntriesSchema.parse(params ?? {});

    const mySqlEntriesRepository = new MySqlEntriesRepository();

    const result = await mySqlEntriesRepository.getEntries();

    if (result instanceof Error) throw result;

    const entries =
      params.format === "radar" ? result.map(formatRadar) : result;

    return successResponse(entries);
  } catch (error) {
    console.error({ error });
    return errorResponse(error as Error);
  }
};
