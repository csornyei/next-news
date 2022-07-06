import { BSONTypeError } from "bson";
import { NextApiRequest, NextApiResponse } from "next";
import { getDatabase } from "../../utils/database";
import {
  validateMethodMiddleware,
  validateAuthMiddleware,
} from "../../utils/middlewares";
import { Response } from "../../utils/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  try {
    validateMethodMiddleware("DELETE", req, res);
    await validateAuthMiddleware(req, res);
  } catch (error) {
    console.error(error);
    return;
  }
  if (!("id" in req.query)) {
    res.status(400).json({ error: "feed id required", message: "error" });
    return;
  }
  let db;
  try {
    db = await getDatabase();
    const deletedCount = await db.deleteFeed(req.query.id as string);
    if (deletedCount === 0) {
      res
        .status(404)
        .json({ error: "no feed found with this id", message: "error" });
    } else {
      res.status(200).json({ error: "", message: "feed deleted" });
    }
  } catch (error) {
    if (error instanceof BSONTypeError) {
      res.status(400).json({ error: "invalid id", message: "error" });
      return;
    }
    res.status(500).json({ error: "server error", message: "error" });
  } finally {
    db?.close();
  }
}
