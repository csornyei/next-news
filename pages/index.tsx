import axios from "axios";
import type { NextPage } from "next";

const Home: NextPage = () => {
  const buttonClicked = async () => {
    const { data } = await axios.get(
      `/api/cors?url=https://www.esquire.com/rss/style.xml/`
    );
    console.log(data);
  };

  return (
    <div>
      <button className="btn btn-primary w-64 rounded" onClick={buttonClicked}>
        Get Feeds
      </button>
    </div>
  );
};

export default Home;
