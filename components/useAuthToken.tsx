import { useState } from "react";
import useInput from "./useInput";

function useAuthToken() {
  const { value: inputText, component: Input } = useInput();
  const [authToken, setAuthToken] = useState("");
  const AuthTokenForm = (
    <div className="form-control ml-6 mt-4 mr-6 md:mr-0">
      <label className="label">
        <span className="label-text">Auth token</span>
      </label>
      {Input()}
      <button
        className="btn btn-sm btn-primary w-16 mt-2"
        onClick={() => {
          setAuthToken(inputText);
        }}
        disabled={inputText.length === 0}
      >
        Set
      </button>
    </div>
  );

  return { authToken, AuthTokenForm };
}

export default useAuthToken;
