import { useState } from "react";

function useAuthToken() {
  const [inputText, setInputText] = useState("");
  const [authToken, setAuthToken] = useState("");
  const AuthTokenForm = (
    <div className="form-control ml-6 mt-4 mr-6 md:mr-0">
      <label className="label">
        <span className="label-text">Auth token</span>
      </label>
      <input
        type="text"
        placeholder="Auth token"
        className="input input-bordered w-full max-w-xs"
        onChange={({ target: { value } }) => {
          setInputText(value);
        }}
      />
      <button
        className="btn btn-sm btn-primary w-16 mt-2"
        onClick={() => {
          setAuthToken(inputText);
        }}
      >
        Set
      </button>
    </div>
  );

  return { authToken, AuthTokenForm };
}

export default useAuthToken;
