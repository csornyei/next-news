import axios from "axios";
import { randomUUID } from "crypto";
import { XMLParser } from "fast-xml-parser";

import type { NextPage } from "next";
import { connectToDatabase, getFeeds, Feed } from "../utils/database";

const Home: NextPage<any> = ({ articles, feeds }) => {
  console.log(feeds);
  console.log(articles);

  return <div></div>;
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

interface LocalFeed extends Feed {
  id: string;
}

export async function getStaticProps() {
  const articles: any[] = [];
  const feeds: LocalFeed[] = [];
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
      feeds.push({ id: randomUUID(), ...feed });
    }
    await Promise.all(
      feeds.map(async ({ url, id }) => {
        try {
          articles.push({ id, ...(await getRssData(url)) });
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
