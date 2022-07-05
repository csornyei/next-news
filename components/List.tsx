import { useRef, useState } from "react";
import { Item } from "../utils/types";
import Card from "./Card";

interface ListProps {
  id: string;
  title: string;
  link: string;
  items: Item[];
}

function List({ id, title, link, items }: ListProps) {
  const [showAll, setShowAll] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section ref={sectionRef}>
      <h2 className="text-lg font-bold ml-6 mt-4">
        <a href={link} target="_blank" rel="noopener noreferrer">
          {title}
        </a>
      </h2>
      <div className="flex flex-row flex-wrap">
        {items.map((item, index) => {
          if (showAll) {
            return <Card key={`${id}-${item.link}`} item={item} />;
          } else {
            return index < 10 ? (
              <Card key={`${id}-${item.link}`} item={item} />
            ) : null;
          }
        })}
      </div>
      <button
        className="btn btn-primary ml-4"
        onClick={() => {
          setShowAll(!showAll);
          if (showAll && sectionRef.current) {
            sectionRef.current.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        }}
      >
        {showAll ? "Hide" : "Show all"}
      </button>
    </section>
  );
}

export default List;
