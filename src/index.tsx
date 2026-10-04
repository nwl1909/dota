import React from "react";
import { render, hydrate } from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import store from "./store";
import { getMetadata, getStrings } from "./actions";
import App from "./components/App/App";
import "./tokens.css";
import "./index.css";

// Fetch metadata (used on all pages)
//@ts-expect-error
store.dispatch(getMetadata());
// Fetch strings
//@ts-expect-error
store.dispatch(getStrings());

// GitHub Pages: сайт лежит в подпапке (/имя-репозитория/), берём её из vite base
const basename = import.meta.env.BASE_URL.replace(/\/$/, "");

const rootElement = document.getElementById("root");

const app = (
  <Provider store={store}>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </Provider>
);

if (rootElement?.hasChildNodes()) {
  hydrate(app, rootElement);
} else {
  render(app, rootElement);
}

// Remove loader
const loader = document.getElementById("loader");
if (loader) {
  loader.remove();
}
