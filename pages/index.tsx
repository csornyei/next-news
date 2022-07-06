import type { NextPage } from "next";
import { v4 } from "uuid";

import List from "../components/List";
import { getDatabase } from "../utils/database";
import { ArticleData, ArticlesMap, FeedsMap, LocalFeed } from "../utils/types";
import { getArticles } from "../utils/rss";

const Home: NextPage<{
  articles: ArticlesMap;
  feeds: FeedsMap;
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

export async function getStaticProps() {
  let articles: ArticlesMap = {};
  const feeds: FeedsMap = {};
  let db;

  try {
    db = await getDatabase();
    (await db.getFeeds()).forEach(({ _id, ...feed }) => {
      const id = v4();
      feeds[id] = { id, ...feed };
    });
    articles = await getArticles(feeds);
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
