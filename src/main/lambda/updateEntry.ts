import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { successResponse } from "../responses/successResponse";
import { errorResponse } from "../responses/errorResponse";
import { EntryEntity } from "../entities/entryEntity";
import { EntryDTO, EntrySchema } from "../dto/EntryDTO";
import { z } from "zod";
import { MySqlEntriesRepository } from "../repositories/mySqlEntriesRepository";
import { formatRadar } from "../utils/formatRadar";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const { body, pathParameters } = event;

    const entryId = parseInt(pathParameters?.id as string);
    z.number({ invalid_type_error: "id must be a number" }).parse(entryId);

    const mySqlEntriesRepository = new MySqlEntriesRepository();

    const entry = await mySqlEntriesRepository.getEntryById(entryId);

    if (entry instanceof Error) throw entry;

    const bodyEntry: EntryDTO = JSON.parse(body as string);
    EntrySchema.parse(bodyEntry);

    const updateEntry: EntryEntity = {
      kc_id: bodyEntry.kc_id,
      chapter_id: bodyEntry.chapter_id,
      responsable: bodyEntry.responsable,
      responsable_email: bodyEntry.responsable_email,
      tipificacion: bodyEntry.tipificacion,
      tema_principal: bodyEntry.tema_principal,
      sub_tema: bodyEntry.sub_tema,
      obsolescencia: bodyEntry.fecha_obsolescencia,
      siguiente_fase: bodyEntry.fecha_siguiente_fase,
      fase_id: bodyEntry.Fase_id,
      descripcion: bodyEntry.descripcion,
      ruta_habilitacion: bodyEntry.ruta_habilitacion,
      artefacto: bodyEntry.artefacto,
      reto_asincrono: bodyEntry.reto_asincrono,
      charla: bodyEntry.charla,
      solicitud_priorizacion: bodyEntry.solicitud_priorizacion,
      necesidad: bodyEntry.necesidad,
    };

    const result = await mySqlEntriesRepository.updateEntry(
      entryId,
      updateEntry
    );

    if (result instanceof Error) throw result;

    const entryUpdated = await mySqlEntriesRepository.getEntryById(entryId);

    if (entryUpdated instanceof Error) throw entryUpdated;

    return successResponse(formatRadar(entryUpdated));
  } catch (error) {
    console.error({ error });
    return errorResponse(error as Error);
  }
};
