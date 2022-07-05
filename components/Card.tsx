import { ReactNode } from "react";
import { Item } from "../utils/types";
import { polyfill } from "interweave-ssr";
import { Markup } from "interweave";

function CategoryBadge({ children }: { children: ReactNode }) {
  return <span className="badge badge-outline text-xs mr-2">{children}</span>;
}

function Card({ item }: { item: Item }) {
  const categorySpans = Array.isArray(item.category)
    ? item.category.map((category) => (
        <CategoryBadge key={category}>{category}</CategoryBadge>
      ))
    : [<CategoryBadge key={item.category}> {item.category} </CategoryBadge>];
  polyfill();
  return (
    <article className="card w-full sm:w-48 lg:w-60 bg-base-200 shadow-xl ml-4 mb-6 mr-4 sm:mr-0">
      <div className="card-body">
        <h3 className="card-title text-lg">
          <a href={item.link} target="_blank" rel="noopener noreferrer">
            <Markup content={item.title} noWrap />
          </a>
        </h3>
        <div>
          <Markup content={item.description} noWrap />
        </div>
        <div className="justify-end">{categorySpans}</div>
      </div>
    </article>
  );
}

export default Card;
