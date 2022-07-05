import { LocalFeed } from "../../utils/types";
import { connectToDatabase, getFeeds } from "../../utils/database";

interface FeedListPageProps {
  feeds: LocalFeed[];
}

function FeedListPage({ feeds }: FeedListPageProps) {
  return (
    <div>
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 cursor-pointer text-error"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    onClick={() => {
                      console.log(`Deleting ${feed.id}`);
                    }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
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
