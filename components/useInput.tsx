import { useState, useEffect } from "react";
import Input from "./Input";

interface useInputProps {
  suggestions: string[];
}

export default function useInput(
  { suggestions }: useInputProps = {
    suggestions: [],
  }
) {
  const [value, setValue] = useState("");

  const clear = () => {
    setValue("");
  };

  const component = (className: string = "") => (
    <Input
      className={className}
      value={value}
      setValue={setValue}
      suggestions={suggestions}
    />
  );

  return { value, component, clear };
}
