import { useState } from "react";
import axios from "axios";
import useAuthToken from "../../components/useAuthToken";
import { LocalFeed } from "../../utils/types";
import { getDatabase } from "../../utils/database";
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
    <div className="w-10/12">
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
  let db;
  let feeds: LocalFeed[] = [];
  try {
    db = await getDatabase();
    feeds = (await db.getFeeds()).map(({ _id, ...feed }) => {
      return { ...feed, id: _id.toString() };
    });
  } catch (error) {
    console.error(error);
  } finally {
    await db?.close();
  }
  return {
    props: {
      feeds,
    },
  };
}

export default FeedListPage;
