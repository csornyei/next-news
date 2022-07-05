import { NextApiRequest, NextApiResponse } from "next";
import {
  connectToDatabase,
  isTokenValid,
  saveFeeds,
} from "../../utils/database";
import {
  validateMethodMiddleware,
  validateAuthMiddleware,
} from "../../utils/middlewares";
import { Response } from "../../utils/types";

interface RequestFeed {
  title?: string;
  url?: string;
  tags?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  try {
    validateMethodMiddleware("POST", req, res);
    await validateAuthMiddleware(req, res);
  } catch (error) {
    return;
  }
  if (
    !("feeds" in req.body) ||
    !Array.isArray(req.body.feeds) ||
    req.body.feeds.length === 0
  ) {
    res.status(400).json({ error: "missing feeds!", message: "error" });
  }
  let client;
  try {
    client = await connectToDatabase();
    const database = await client.db("next-news");
    const feedDocuments = req.body.feeds.filter((feed: RequestFeed) => {
      return "title" in feed && "url" in feed;
    });
    const count = await saveFeeds(database, feedDocuments);
    client.close();
    res.status(200).json({ error: "", message: `${count} feeds added!` });
  } catch (error) {
    client?.close();
    res.status(500).json({ error: "internal server error", message: "error" });
  }
}
