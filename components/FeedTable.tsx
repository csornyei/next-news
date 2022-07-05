import { LocalFeed } from "../utils/types";
import { Delete, Loader } from "./icons";

interface FeedTableProps {
  rows: LocalFeed[];
  loadings: string[];
  onDelete: (id: string) => Promise<void>;
}

export default function FeedTable({
  rows,
  loadings,
  onDelete,
}: FeedTableProps) {
  const isLoading = (id: string) => {
    return loadings.indexOf(id) !== -1;
  };
  return (
    <table className="table mx-6 mt-4 w-full">
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
        {rows.map((feed, idx) => {
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
                  <Delete onClick={() => onDelete(feed.id)} />
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
