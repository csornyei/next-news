import axios from "axios";
import { startTransition, useEffect, useState } from "react";
import { Add, Cross } from "../icons";
import useInput from "../useInput";

interface TagInputProps {
  tags: string[];
  setTags: (tags: string[]) => void;
}

export default function TagInput({ tags, setTags }: TagInputProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const {
    value: tagValue,
    component: Input,
    clear,
  } = useInput({ suggestions });

  useEffect(() => {
    startTransition(() => {
      if (tagValue.length > 0) {
        axios
          .post("/api/suggest-tags", {
            tag: tagValue,
          })
          .then(({ data }) => {
            setSuggestions(data.message);
          })
          .catch(() => {});
      } else {
        setSuggestions([]);
      }
    });
  }, [tagValue]);

  return (
    <div className="form-control ml-6 md:ml-0 mt-4 mr-6 lg:mr-0 w-full lg:w-6/12">
      <label className="label">
        <span className="label-text">Tags</span>
      </label>
      <div className="input-group">
        {Input("")}
        <button
          className="btn btn-accent btn-square w-12 h-12 z-20"
          onClick={() => {
            if (tagValue.length > 0) {
              setTags([...tags, tagValue]);
              clear();
            }
          }}
        >
          <Add />
        </button>
      </div>
      <div>
        {tags.map((t, idx) => {
          return (
            <span
              className="badge badge-accent mt-2 mr-2 cursor-pointer transition-transform duration-200 active:-translate-y-1 active:opacity-50"
              key={idx}
              onClick={() => {
                setTags(tags.filter((tag) => tag !== t));
              }}
            >
              <Cross className="h-4 w-4" />
              {t}
            </span>
          );
        })}
      </div>
    </div>
  );
}
