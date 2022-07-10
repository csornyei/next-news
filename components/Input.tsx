import { Fragment } from "react";

interface InputProps {
  className: string;
  value: string;
  setValue: (value: string) => void;
  suggestions: string[];
}

export default function Input({
  className,
  value,
  setValue,
  suggestions = [],
}: InputProps) {
  return (
    <Fragment>
      <input
        type="text"
        value={value}
        className={`input input-bordered w-full max-w-xs ${className}`}
        onChange={({ target: { value } }) => {
          setValue(value);
        }}
      />
      {suggestions.length > 0 ||
      (suggestions.length === 1 && suggestions[0] === value) ? (
        <ul className="w-full max-w-xs z-20">
          {suggestions.map((s, idx) => (
            <li
              className="px-2 mx-2 border rounded-sm border-slate-400 cursor-pointer hover:bg-accent"
              key={idx}
              onClick={() => {
                setValue(s);
              }}
            >
              {s}
            </li>
          ))}
        </ul>
      ) : null}
    </Fragment>
  );
}
