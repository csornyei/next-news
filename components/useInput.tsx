import { useState } from "react";

export default function useInput() {
  const [value, setValue] = useState("");

  const clear = () => {
    setValue("");
  };

  const component = (className: string = "") => (
    <input
      type="text"
      value={value}
      className={`input input-bordered w-full max-w-xs ${className}`}
      onChange={({ target: { value } }) => {
        setValue(value);
      }}
    />
  );

  return { value, component, clear };
}
