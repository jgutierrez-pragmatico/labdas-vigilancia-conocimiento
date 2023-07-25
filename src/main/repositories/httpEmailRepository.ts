import axios from "axios";
import { EntryEntity } from "../entities/entryEntity";

export class HttpEmailRepository {
  async getToken(): Promise<string | null> {
    const {
      EMAIL_AUTH_URL,
      EMAIL_AUTHORIZATION,
      EMAIL_AUTH_CLIENT_ID,
      EMAIL_AUTH_SCOPE,
    } = process.env;

    const { status, data } = await axios.post(EMAIL_AUTH_URL as string, null, {
      headers: {
        authorization: EMAIL_AUTHORIZATION,
        client_id: EMAIL_AUTH_CLIENT_ID,
        scope: EMAIL_AUTH_SCOPE,
      },
    });

    if (status !== 200) {
      return null;
    }

    return data.token;
  }

  async sendEmailNewEntry(entry: EntryEntity): Promise<void | Error> {
    try {
      const { EMAIL_URL_API } = process.env;

      const url = `${EMAIL_URL_API}/mensaje`;

      const token = await this.getToken();

      const { tema_principal, sub_tema, kc_nombre, chapter_nombre } = entry;

      const data = {
        destinos: [entry.responsable_email],
        asunto: "Vigilancia de Conocimiento",
        html: `<html>
            <p>
                Se ha registrado el siguiente conocimiento ${tema_principal} - ${sub_tema} donde eres el responsable para el KC ${kc_nombre} y chapter ${chapter_nombre}.
            </p>
            <p>
                Actualiza la fase y completa la información.
            </p>
        </html>`,
      };

      const { status } = await axios.post(url, data, {
        headers: {
          Authorization: token,
        },
      });

      if (status !== 200) {
        console.log("error status: ", status);
        return new Error("Internal Server Error");
      }
    } catch (error) {
      return new Error("internal server error");
    }
  }
}
