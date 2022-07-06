import { v4 } from "uuid";
import { useRouter } from "next/router";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";

import List from "../../components/List";
import SkeletonList from "../../components/SkeletonList";
import { getDatabase } from "../../utils/database";
import { getArticles } from "../../utils/rss";
import { ArticlesMap, FeedsMap } from "../../utils/types";

type TagPageProps = {
  articles: ArticlesMap;
  feeds: FeedsMap;
};

const TagPage: NextPage<TagPageProps> = ({ articles, feeds }) => {
  const router = useRouter();

  if (router.isFallback) {
    return (
      <div>
        <SkeletonList />
      </div>
    );
  }
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

export default TagPage;

export const getStaticPaths: GetStaticPaths = async () => {
  let db;
  const paths: { params: { tag: string } }[] = [];
  try {
    db = await getDatabase();
    const tags = await db.getTags();
    tags.forEach(({ tag }) => {
      paths.push({ params: { tag } });
    });
  } catch (error) {
    console.error(error);
  } finally {
    db?.close();
  }
  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (!params || !params.tag) {
    console.error("No tag param found!");
    return {
      props: {},
      revalidate: 60 * 60,
    };
  }
  const tag = Array.isArray(params.tag) ? params.tag[0] : params.tag;
  let db;
  let articles: ArticlesMap = {};
  const feeds: FeedsMap = {};
  try {
    db = await getDatabase();
    (await db.getFeeds(tag)).forEach(({ _id, ...feed }) => {
      const id = v4();
      feeds[id] = { id, ...feed };
    });
    articles = await getArticles(feeds);
  } catch (error) {
    console.error(error);
  } finally {
    db?.close();
  }
  return {
    props: {
      articles,
      feeds,
    },
    revalidate: 60 * 60,
  };
};
