import "../styles/globals.css";
import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div data-theme="garden">
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
