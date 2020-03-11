import "./styles.css";

import h from "./lib/vnode";
import diff from "./lib/diff";
import commitWork, { resolveQueue, resetQueue } from "./lib/commit_work";
import { render, hydrate } from "./lib/render";

const root = document.getElementById("app");

let instance;
const App = (text, type = "") => {
  const app = h(
    "div",
    { style: "border: 2px solid pink;" },
    h("h1", null, text),
    h(
      "button",
      {
        onClick:
          type === "RENDER"
            ? () => {
                alert("Hello");
              }
            : () => {
                resetQueue();
                diff(
                  root,
                  App("JDOM after render", "RENDER"),
                  instance,
                  resolveQueue()
                );
                commitWork();
              }
      },
      "Click me"
    )
  );

  if (typeof instance === "undefined") {
    instance = app;
  }

  return app;
};

render(App("JDOM"), root);
hydrate(App("Hydrated DOM", "RENDER"), document.getElementById("app2"));
