import { NextApiRequest, NextApiResponse } from "next";
import { getDatabase } from "../../utils/database";
import sendEmail from "../../utils/email";
import { isIssuedInLastHour, newToken } from "../../utils/token";
import { Response } from "../../utils/types";

export default async function handler(
  _: NextApiRequest,
  res: NextApiResponse<Response>
) {
  let db;
  try {
    db = await getDatabase();
    const token = await db.getLatestToken();
    if (token) {
      if (isIssuedInLastHour(token)) {
        res.status(400).json({
          error: "there is already a valid token to use!",
          message: "error",
        });
        db.close();
        return;
      }
    }
    const t = newToken();
    await db.saveToken(t);
    await sendEmail(t);
    res.status(200).json({ message: "token sent", error: "" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "internal server error", message: "error" });
  } finally {
    db?.close();
  }
}
