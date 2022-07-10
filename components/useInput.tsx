import { useState, useEffect } from "react";
import Input from "./Input";

interface useInputProps {
  setValueEffect: (value: string) => any;
  suggestions: string[];
}

export default function useInput(
  { setValueEffect, suggestions }: useInputProps = {
    setValueEffect: (_) => {},
    suggestions: [],
  }
) {
  const [value, setValue] = useState("");

  const clear = () => {
    setValue("");
  };

  useEffect(() => {
    setValueEffect(value);
  }, [value, setValueEffect]);

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
