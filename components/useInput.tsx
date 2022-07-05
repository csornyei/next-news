import { useState } from "react";

export default function useInput() {
  const [value, setValue] = useState("");

  const component = (className: string = "") => (
    <input
      type="text"
      className={`input input-bordered w-full max-w-xs ${className}`}
      onChange={({ target: { value } }) => {
        setValue(value);
      }}
    />
  );

  return { value, component };
}
