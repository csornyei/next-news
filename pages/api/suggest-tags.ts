import { NextApiRequest, NextApiResponse } from "next";
import { getDatabase } from "../../utils/database";
import { validateMethodMiddleware } from "../../utils/middlewares";
import Trie from "../../utils/suggestions";
import { Response } from "../../utils/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  try {
    validateMethodMiddleware("POST", req, res);
  } catch (error) {
    return;
  }
  if (!req.body && !req.body.tag) {
    return res.status(400).json({ error: "tag is missing", message: "error" });
  }
  const { tag } = req.body;
  let db;
  try {
    db = await getDatabase();
    const tags = (await db.getTags(6))
      .sort((a, b) => b.count - a.count)
      .map(({ tag }) => tag);
    const trie = new Trie();
    trie.insert(tags);
    const suggestions = trie.getSuggestions(tag);
    res.status(200).json({ message: suggestions, error: "" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "internal server error", message: "error" });
  } finally {
    db?.close();
  }
}
