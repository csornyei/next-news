import { useState } from "react";
import { Feed } from "../../utils/types";
import useInput from "../useInput";
import TagInput from "./TagInput";

interface NewFeedProps {
  addFeed: (feed: Feed) => void;
}

export default function NewFeedForm({ addFeed }: NewFeedProps) {
  const [tags, setTags] = useState<string[]>([]);
  const { value: title, component: TitleInput } = useInput();
  const { value: url, component: UrlInput } = useInput();
  return (
    <section className="flex flex-row flex-wrap ml-0 md:ml-6 w-11/12">
      <div className="form-control ml-6 md:ml-0 mt-4 mr-6 lg:mr-0 w-full lg:w-3/12">
        <label className="label">
          <span className="label-text">Title</span>
        </label>
        {TitleInput()}
      </div>
      <div className="form-control ml-6 md:ml-0 mt-4 mr-6 lg:mr-0 w-full lg:w-3/12">
        <label className="label">
          <span className="label-text">URL</span>
        </label>
        {UrlInput()}
      </div>
      <TagInput tags={tags} setTags={setTags} />
      <button
        className="btn btn-sm btn-secondary w-16 mt-2 ml-6 md:ml-0"
        disabled={title.length === 0 || url.length === 0}
        onClick={() => {
          addFeed({
            title,
            url,
            tags,
          });
        }}
      >
        Add
      </button>
    </section>
  );
}