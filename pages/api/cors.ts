import axios from "axios";
import { XMLParser } from "fast-xml-parser";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  items: any[];
};

type Error = {
  error: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  let url = req.query.url;
  if (!url || url?.length === 0) {
    res.status(400).json({ error: "Url should not be empty!" });
    return;
  }
  if (Array.isArray(url)) {
    url = url[0];
  }
  try {
    const { data } = await axios.get(url);
    const parser = new XMLParser();
    const parsed = parser.parse(data);
    if (
      Object.prototype.hasOwnProperty.call(parsed, "rss") &&
      Object.prototype.hasOwnProperty.call(parsed.rss, "channel")
    ) {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.status(200).json(parsed.rss.channel);
      return;
    }
    res.status(500).json({ error: "Can't parse rss feed!" });
  } catch (error) {
    res.status(500).json({ error: "invalid url!" });
  }
}
