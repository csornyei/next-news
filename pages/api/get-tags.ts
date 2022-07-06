import { NextApiRequest, NextApiResponse } from "next";
import { getDatabase } from "../../utils/database";
import { validateMethodMiddleware } from "../../utils/middlewares";
import { Response } from "../../utils/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  try {
    validateMethodMiddleware("GET", req, res);
  } catch (error) {
    return;
  }
  let db;
  try {
    db = await getDatabase();
    const tags = await db.getTags();
    res.status(200).json({ error: "", message: tags });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "internal server error", message: "error" });
  } finally {
    db?.close();
  }
}
