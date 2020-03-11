import "./styles.css";

import h from "./lib/vnode";
import diff from "./lib/diff";
import commitWork, { resolveQueue, resetQueue } from "./lib/commit_work";
import { render, hydrate } from "./lib/render";

const root = document.getElementById("app");

const App2 = ({ color, children }) =>
  h("div", { style: `background: ${color};` }, ...children);

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
                  App(h("a", { href: "/" }, "JDOM after render"), "RENDER"),
                  instance,
                  resolveQueue()
                );
                commitWork();
              }
      },
      "Click me"
    ),
    h(App2, { color: "purple" }, "Cute pie")
  );

  if (typeof instance === "undefined") {
    instance = app;
  }

  return app;
};

render(App("JDOM"), root);

const app2 = document.getElementById("app2");
app2.innerHTML =
  '<div style="border: 2px solid pink;"><h1>Hydrated DOM</h1><button>Click me</button></div>';

hydrate(App("Hydrated DOM", "RENDER"), document.getElementById("app2"));
