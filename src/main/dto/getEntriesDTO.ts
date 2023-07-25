import { z } from "zod";

export const getEntriesSchema = z
  .object({
    format: z.enum(["radar", "table"], {
      required_error: "query param format is required",
    }),
  })
  .strict();

export type getEntriesDTO = z.infer<typeof getEntriesSchema>;
