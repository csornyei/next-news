import axios from "axios";
import type { NextPage } from "next";
import { XMLParser } from "fast-xml-parser";
import { v4 } from "uuid";

import List from "../components/List";
import { getDatabase } from "../utils/database";
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
  let db;

  try {
    db = await getDatabase();
    (await db.getFeeds()).forEach(({ _id, ...feed }) => {
      const id = v4();
      feeds[id] = { id, ...feed };
    });
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
    db?.close();
  }

  return {
    props: {
      articles,
      feeds,
    },
    revalidate: 12 * 60 * 60,
  };
}
