import { randomUUID } from "crypto";
import { compareAsc } from "date-fns";
import add from "date-fns/add";
import { NextApiRequest, NextApiResponse } from "next";
import {
  connectToDatabase,
  getLatestToken,
  saveToken,
} from "../../utils/database";
import sendEmail from "../../utils/email";
import { isIssuedInLastHour, newToken } from "../../utils/token";

interface Response {
  message: string;
  error: string;
}

export default async function handler(
  _: NextApiRequest,
  res: NextApiResponse<Response>
) {
  let client;
  try {
    client = await connectToDatabase();
    const database = await client.db("next-news");
    const tokens = await getLatestToken(database);
    const token = await tokens.next();
    if (token) {
      if (isIssuedInLastHour(token)) {
        res.status(400).json({
          error: "there is already a valid token to use!",
          message: "error",
        });
        return;
      }
    }
    const t = newToken();
    await saveToken(database, t);
    await sendEmail(t);
    res.status(200).json({ message: "token sent", error: "" });
    client.close();
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "internal server error", message: "error" });
    client?.close();
    return;
  }
}
