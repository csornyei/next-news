import axios from "axios";
import { randomUUID } from "crypto";
import type { NextPage } from "next";
import { XMLParser } from "fast-xml-parser";

import List from "../components/List";
import { connectToDatabase, getFeeds } from "../utils/database";
import { ArticleData, LocalFeed } from "../utils/types";

const Home: NextPage<{
  articles: { [key: string]: ArticleData };
  feeds: { [key: string]: LocalFeed };
}> = ({ articles, feeds }) => {
  return (
    <div>
      {Object.values(articles).map((article) => {
        const source = feeds[article.id];
        return (
          <List
            key={article.id}
            id={article.id}
            title={source.title}
            link={source.url}
            items={article.item}
          />
        );
      })}
    </div>
  );
};

export default Home;

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

export async function getStaticProps() {
  const articles: { [key: string]: ArticleData } = {};
  const feeds: { [key: string]: LocalFeed } = {};
  let client;

  try {
    client = await connectToDatabase();
    const database = await client.db("next-news");
    const feedsCursor = await getFeeds(database);
    while (await feedsCursor.hasNext()) {
      const next = await feedsCursor.next();
      if (!next) {
        break;
      }
      const { _id, ...feed } = next;
      const id = randomUUID();
      feeds[id] = { id, ...feed };
    }
    await Promise.all(
      Object.entries(feeds).map(async ([id, { url }]) => {
        try {
          articles[id] = { id, ...(await getRssData(url)) };
        } catch (error) {
          console.error(error);
        }
      })
    );
  } catch (error) {
    console.error(error);
    return {
      props: {},
    };
  } finally {
    client?.close();
  }

  return {
    props: {
      articles,
      feeds,
    },
    revalidate: 12 * 60 * 60,
  };
}
