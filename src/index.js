import "./styles.css";

import h from "./lib/vnode";
import { render, hydrate } from "./lib/render";

const run = () => {
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
                  render(
                    App(h("a", { href: "/" }, "JDOM after render"), "RENDER"),
                    root,
                    instance
                  );
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

  hydrate(App("Hydrated DOM", "RENDER"), app2);

  const app3 = document.getElementById("app3");
  render(App("JDOM", "RENDER"), app3);
};

run();
