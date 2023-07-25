import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { successResponse } from "../responses/successResponse";
import { errorResponse } from "../responses/errorResponse";
import { z } from "zod";
import { MySqlEntriesRepository } from "../repositories/mySqlEntriesRepository";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const { pathParameters } = event;
    const entryId = parseInt(pathParameters?.id as string);

    z.number({ invalid_type_error: "id must be a number" }).parse(entryId);

    const mySqlEntriesRepository = new MySqlEntriesRepository();

    const entry = await mySqlEntriesRepository.getEntryById(entryId);

    if (entry instanceof Error) throw entry;

    return successResponse(entry);
  } catch (error) {
    console.error({ error });
    return errorResponse(error as Error);
  }
};
