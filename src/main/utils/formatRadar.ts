import { EntryEntity } from "../entities/entryEntity";

export const formatRadar = (entry: EntryEntity) => {
  return {
    timeline: [
      {
        moved: 0,
        ringId: entry.fase_nombre,
        date: entry.obsolescencia ? new Date(entry.obsolescencia) : null,
        description: entry.tipificacion,
      },
    ],
    key: entry.kc_nombre,
    id: entry.id_radar?.toString(),
    title: entry.tema_principal,
    quadrant: entry.kc_nombre,
    links: [
      {
        url: entry.url,
        title: "code",
      },
    ],
    description: entry.chapter_nombre,
  };
};
