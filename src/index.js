import "./styles.css";

import h from "./lib/vnode";
import { render } from "./lib/render";

const App = (text, type = "") =>
  h(
    "div",
    { style: "border: 2px solid pink;" },
    h("h1", null, text),
    h(
      "button",
      {
        onClick:
          type === "RENDER"
            ? () => {
                render(
                  App("JDOM after render effect"),
                  document.getElementById("app4")
                );
                render(
                  App("JDOM after render effect 2"),
                  document.getElementById("app5")
                );
              }
            : () => alert("Hello")
      },
      "Click me"
    )
  );

render(App("JDOM"), document.getElementById("app"));
render(
  App("JDOM with render effect", "RENDER"),
  document.getElementById("app2")
);
