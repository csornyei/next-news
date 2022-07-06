import axios from "axios";
import { XMLParser } from "fast-xml-parser";
import { ArticleData, ArticlesMap, FeedsMap, LocalFeed } from "./types";

async function getRssData(url: string) {
  const { data } = await axios.get(url);
  const parser = new XMLParser();
  const parsed = parser.parse(data);
  if (
    Object.prototype.hasOwnProperty.call(parsed, "rss") &&
    Object.prototype.hasOwnProperty.call(parsed.rss, "channel")
  ) {
    return parsed.rss.channel;
  }
  throw new Error("Can't get rss data!");
}

export async function getArticles(feeds: FeedsMap): Promise<ArticlesMap> {
  const articles: { [key: string]: ArticleData } = {};

  await Promise.all(
    Object.entries(feeds).map(async ([id, { url }]) => {
      try {
        articles[id] = { id, ...(await getRssData(url)) };
      } catch (error) {
        console.error(error);
      }
    })
  );

  return articles;
}
