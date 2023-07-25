import { z } from "zod";

export const EntrySchema = z
  .object({
    kc_id: z.number().optional(),
    chapter_id: z.number().optional(),
    responsable: z.string().optional(),
    responsable_email: z.string().email().optional(),
    tipificacion: z.string().optional(),
    tema_principal: z.string().optional(),
    sub_tema: z.string().optional(),
    fecha_obsolescencia: z.string().optional(),
    fecha_siguiente_fase: z.string().optional(),
    Fase_id: z.number().optional(),
    descripcion: z.string().optional(),
    ruta_habilitacion: z.string().optional(),
    artefacto: z.string().optional(),
    reto_asincrono: z.string().optional(),
    charla: z.string().optional(),
    solicitud_priorizacion: z.string().optional(),
    necesidad: z.string().optional(),
  })
  .strict();

export type EntryDTO = z.infer<typeof EntrySchema>;
