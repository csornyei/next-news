import axios from "axios";
import { XMLParser } from "fast-xml-parser";

import type { NextPage } from "next";
import { connectToDatabase, getFeeds } from "../utils/database";

const Home: NextPage<any> = ({ feedData }) => {
  // console.log(feedData);

  return <div></div>;
  };

export default Home;

export async function getStaticProps() {
  const feeds = [
  ];

  const feedData = [];

  let client;

  try {
    client = await connectToDatabase();
    const database = await client.db("next-news");
    console.log(await getFeeds(database));
  } catch (error) {
    console.error(error);
    return {
      props: {},
};
  } finally {
    client?.close();
  }

  for (let index = 0; index < feeds.length; index++) {
    const url = feeds[index];
    const { data } = await axios.get(url);
    const parser = new XMLParser();
    const parsed = parser.parse(data);
    if (
      Object.prototype.hasOwnProperty.call(parsed, "rss") &&
      Object.prototype.hasOwnProperty.call(parsed.rss, "channel")
    ) {
      feedData.push(parsed.rss.channel);
    }
  }

  return {
    props: {
      feedData,
    },
    revalidate: 12 * 60 * 60,
  };
}
