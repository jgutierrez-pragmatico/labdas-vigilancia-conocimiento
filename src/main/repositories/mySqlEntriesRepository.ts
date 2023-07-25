import { dbClient } from "../db/dbClient";
import { EntryEntity } from "../entities/entryEntity";
import { NotFoundError } from "../responses/NotFoundError";

export class MySqlEntriesRepository {
  async getEntries(): Promise<EntryEntity[] | Error> {
    try {
      const result = await dbClient<EntryEntity>("radar_entry")
        .select(
          "radar_entry.*",
          "radar_kc.nombre as kc_nombre",
          "radar_chapter.nombre as chapter_nombre",
          "radar_fase.nombre as fase_nombre"
        )
        .leftJoin("radar_kc", "radar_kc.id", "radar_entry.kc_id")
        .leftJoin("radar_chapter", "radar_chapter.id", "radar_entry.chapter_id")
        .leftJoin("radar_fase", "radar_fase.id", "radar_entry.fase_id");

      return result;
    } catch (error) {
      return new Error("internal server error");
    }
  }

  async getEntryById(id: number): Promise<EntryEntity | Error> {
    try {
      const entry = await dbClient<EntryEntity>("radar_entry")
        .select(
          "radar_entry.*",
          "radar_kc.nombre as kc_nombre",
          "radar_chapter.nombre as chapter_nombre",
          "radar_fase.nombre as fase_nombre"
        )
        .leftJoin("radar_kc", "radar_kc.id", "radar_entry.kc_id")
        .leftJoin("radar_chapter", "radar_chapter.id", "radar_entry.chapter_id")
        .leftJoin("radar_fase", "radar_fase.id", "radar_entry.fase_id")
        .where("id_radar", id)
        .first();

      if (!entry) {
        return new NotFoundError("id not found");
      }

      return entry;
    } catch (error) {
      return new Error("internal server error");
    }
  }

  async createEntry(entry: EntryEntity): Promise<EntryEntity | Error> {
    try {
      const newEntry = await dbClient<EntryEntity>("radar_entry")
        .insert(entry)
        .returning("*");

      return newEntry[0];
    } catch (error) {
      console.log(error);
      return new Error("internal server error");
    }
  }

  async updateEntry(id: number, entry: EntryEntity): Promise<void | Error> {
    try {
      await dbClient("radar_entry").update(entry).where("id_radar", id);
    } catch (error) {
      console.log(error);
      return new Error("internal server error");
    }
  }
}
