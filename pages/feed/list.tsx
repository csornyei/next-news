import { useState } from "react";
import axios from "axios";
import useAuthToken from "../../components/useAuthToken";
import Loader from "../../components/icons/Loader";
import Delete from "../../components/icons/Delete";
import { LocalFeed } from "../../utils/types";
import { connectToDatabase, getFeeds } from "../../utils/database";

interface FeedListPageProps {
  feeds: LocalFeed[];
}

function FeedListPage({ feeds }: FeedListPageProps) {
  const { authToken, AuthTokenForm } = useAuthToken();
  const [loadings, setLoadings] = useState<string[]>([]);

  const addLoading = (id: string) => {
    setLoadings([...loadings, id]);
  };

  const isLoading = (id: string) => {
    return loadings.indexOf(id) !== -1;
  };

  const removeLoading = (id: string) => {
    const oldLoadings = [...loadings];
    setLoadings(oldLoadings.filter((i) => i !== id));
  };

  return (
    <div>
      {authToken}
      <table className="table mx-6 mt-4">
        <thead>
          <tr>
            <th></th>
            <th>Title</th>
            <th>Url</th>
            <th>Tags</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {feeds.map((feed, idx) => {
            return (
              <tr className="hover" key={feed.id}>
                <td> {idx + 1} </td>
                <td> {feed.title} </td>
                <td> {feed.url} </td>
                <td>
                  {feed.tags.map((t) => (
                    <span className="badge badge-secondary mr-2" key={t}>
                      {t}
                    </span>
                  ))}
                </td>
                <td>
                  {isLoading(feed.id) ? (
                    <Loader />
                  ) : (
                    <Delete
                      onClick={async () => {
                        addLoading(feed.id);
                        try {
                          const res = await axios.delete(
                            `/api/delete-feed?id=${feed.id}`,
                            {
                              headers: {
                                Authorization: authToken,
                              },
                            }
                          );
                          console.log(res);
                        } catch (error) {
                          console.error(error);
                        } finally {
                          removeLoading(feed.id);
                        }
                      }}
                    />
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
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
