import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { errorResponse } from "../responses/errorResponse";
import { successResponse } from "../responses/successResponse";
import { EntryEntity } from "../entities/entryEntity";
import { EntryDTO, EntrySchema } from "../dto/EntryDTO";
import { dbClient } from "../db/dbClient";
import { formatRadar } from "../utils/formatRadar";
import { MySqlEntriesRepository } from "../repositories/mySqlEntriesRepository";
import { HttpEmailRepository } from "../repositories/httpEmailRepository";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const { body } = event;

    const bodyEntry: EntryDTO = JSON.parse(body as string);

    EntrySchema.parse(bodyEntry);

    const newEntry: EntryEntity = {
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

    const mySqlEntriesRepository = new MySqlEntriesRepository();

    const result = await mySqlEntriesRepository.createEntry(newEntry);
    if (result instanceof Error) throw result;

    const httpEmailRepository = new HttpEmailRepository();

    const entryCreated = await mySqlEntriesRepository.getEntryById(
      result.id_radar as number
    );

    if (entryCreated instanceof Error) throw entryCreated;

    if (entryCreated.responsable_email) {
      await httpEmailRepository.sendEmailNewEntry(entryCreated);
    }

    return successResponse(formatRadar(entryCreated));
  } catch (error) {
    console.error({ error });
    return errorResponse(error as Error);
  }
};
