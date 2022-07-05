import axios from "axios";
import { useState } from "react";
import FeedTable from "../../components/FeedTable";
import NewFeed from "../../components/NewFeedForm/NewFeedForm";
import useAuthToken from "../../components/useAuthToken";
import { Feed, LocalFeed } from "../../utils/types";

function AddFeedPage() {
  const { authToken, AuthTokenForm } = useAuthToken();
  const [newFeeds, setNewFeeds] = useState<LocalFeed[]>([]);

  const addNewFeed = (feed: Feed) => {
    setNewFeeds([...newFeeds, { ...feed, id: feed.title }]);
  };

  const validateFeed = (feed: Feed) => {
    if (feed.title.length === 0) return false;
    if (feed.url.length === 0) return false;
    const found = newFeeds.findIndex(
      (f) => f.title === feed.title || f.url === feed.url
    );
    if (found !== -1) return false;
    return true;
  };

  const removeFeed = (id: string) => {
    const currentFeeds = [...newFeeds];
    setNewFeeds(
      currentFeeds.filter((feed) => {
        return feed.id !== id;
      })
    );
  };

  return (
    <div>
      {AuthTokenForm}
      <NewFeed addFeed={addNewFeed} validate={validateFeed} />
      <div className="w-10/12">
        <FeedTable
          rows={newFeeds}
          loadings={[]}
          onDelete={async (id: string) => {
            removeFeed(id);
          }}
        />
      </div>
      <div>
        <button
          className="btn btn-primary btn-sm mt-4 ml-4 w-32"
          disabled={authToken.length === 0 || newFeeds.length === 0}
          onClick={async () => {
            try {
              await axios.post(
                "/api/add-feed",
                {
                  feeds: newFeeds.map((f) => {
                    const { id, ...feed } = f;
                    return feed;
                  }),
                },
                {
                  headers: {
                    Authorization: authToken,
                  },
                }
              );
              setNewFeeds([]);
            } catch (error) {
              alert("There was an error while adding feeds!");
            }
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default AddFeedPage;
