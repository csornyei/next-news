import { NextApiRequest, NextApiResponse } from "next";
import {
  connectToDatabase,
  isTokenValid,
  saveFeeds,
} from "../../utils/database";

interface Response {
  message: string;
  error: string;
}

interface RequestFeed {
  title?: string;
  url?: string;
  tags?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "method not allowed", message: "error" });
    return;
  }
  if (!("token" in req.body)) {
    res.status(401).json({ error: "missing token!", message: "error" });
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
    console.log(req.body.token);
    if (!(await isTokenValid(database, req.body.token))) {
      res.status(401).json({ error: "invalid token!", message: "error" });
      return;
    }
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
