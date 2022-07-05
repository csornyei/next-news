import { useState } from "react";
import useInput from "../useInput";
import TagInput from "./TagInput";

interface NewFeedProps {
  addFeed: ({
    name,
    url,
    tags,
  }: {
    name: string;
    url: string;
    tags: string[];
  }) => void;
}

export default function NewFeed({ addFeed }: NewFeedProps) {
  const [tags, setTags] = useState<string[]>([]);
  const { value: nameValue, component: NameInput } = useInput();
  const { value: urlValue, component: UrlInput } = useInput();
  return (
    <section className="flex flex-row flex-wrap ml-0 md:ml-6 w-11/12">
      <div className="form-control ml-6 md:ml-0 mt-4 mr-6 lg:mr-0 w-full lg:w-3/12">
        <label className="label">
          <span className="label-text">Name</span>
        </label>
        {NameInput()}
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
        disabled={nameValue.length === 0 || urlValue.length === 0}
        onClick={() => {
          addFeed({
            name: nameValue,
            url: urlValue,
            tags,
          });
        }}
      >
        Add
      </button>
    </section>
  );
}
