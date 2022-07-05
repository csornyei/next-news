import { useState } from "react";
import axios from "axios";
import useAuthToken from "../../components/useAuthToken";
import { LocalFeed } from "../../utils/types";
import { connectToDatabase, getFeeds } from "../../utils/database";
import FeedTable from "../../components/FeedTable";

interface FeedListPageProps {
  feeds: LocalFeed[];
}

function FeedListPage({ feeds }: FeedListPageProps) {
  const { authToken, AuthTokenForm } = useAuthToken();
  const [loadings, setLoadings] = useState<string[]>([]);

  const addLoading = (id: string) => {
    setLoadings([...loadings, id]);
  };

  const removeLoading = (id: string) => {
    const oldLoadings = [...loadings];
    setLoadings(oldLoadings.filter((i) => i !== id));
  };

  return (
    <div>
      <FeedTable
        rows={feeds}
        loadings={loadings}
        onDelete={async (id: string) => {
          addLoading(id);
          try {
            const res = await axios.delete(`/api/delete-feed?id=${id}`, {
              headers: {
                Authorization: authToken,
              },
            });
            console.log(res);
          } catch (error) {
            console.error(error);
          } finally {
            removeLoading(id);
          }
        }}
      />
      {AuthTokenForm}
    </div>
  );
}

export async function getServerSideProps() {
  let client;
  const feeds = [];
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
      feeds.push({ ...feed, id: _id.toString() });
    }
  } catch (error) {
    console.error(error);
  } finally {
    client?.close();
  }
  return {
    props: {
      feeds,
    },
  };
}

export default FeedListPage;
