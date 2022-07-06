import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronDown } from "./icons";
import axios from "axios";
import { useRouter } from "next/router";

let initialized = false;

interface Tag {
  tag: string;
  count: number;
}

interface Response {
  error: string;
  message: Tag[] | string;
}

export default function Navbar() {
  const router = useRouter();
  const [tags, setTags] = useState<Tag[]>([]);
  const [error, setError] = useState(false);
  useEffect(() => {
    if (!initialized) {
      initialized = true;
      axios
        .get<Response>("/api/get-tags")
        .then((resp) => {
          if (Array.isArray(resp.data.message)) {
            setTags(resp.data.message);
          }
        })
        .catch((err) => {
          setError(true);
        });
    }
  }, []);

  const activePage = () => {
    if (router.pathname !== "/feed/[tag]") {
      return "";
    }
    if (!router.query.tag) {
      return "";
    }
    if (Array.isArray(router.query.tag)) {
      return router.query.tag[0];
    }
    return router.query.tag;
  };

  return (
    <nav className="navbar bg-primary">
      <div className="flex-1">
        <Link href="/">
          <a className="btn btn-ghost capitalize text-xl">Mate's News Site</a>
        </Link>
      </div>
      <div className="flex-none">
        {error ? (
          <div className="menu menu-horizontal p-0">
            <h3 className="text-error">
              There was an error while fetching the categories!
            </h3>
          </div>
        ) : (
          <ul className="menu menu-horizontal p-0">
            {tags.map(({ tag }, idx) => {
              if (idx < 3) {
                return (
                  <li className="pr-1" key={tag}>
                    <Link href={`/feed/${tag}`}>
                      <a
                        className={`capitalize ${
                          activePage() === tag ? "bg-base-300" : ""
                        }`}
                      >
                        {tag}
                      </a>
                    </Link>
                  </li>
                );
              }
            })}
            <li tabIndex={0}>
              <a>
                Other tags
                <ChevronDown />
              </a>
              <ul className="p-2 bg-base-100 z-20">
                {tags.map(({ tag }, idx) => {
                  if (idx >= 3) {
                    return (
                      <li key={tag}>
                        <Link href={`/feed/${tag}`}>
                          <a
                            className={`capitalize ${
                              activePage() === tag ? "bg-base-300" : ""
                            }`}
                          >
                            {tag}
                          </a>
                        </Link>
                      </li>
                    );
                  }
                })}
              </ul>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
}
