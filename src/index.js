import "./styles.css";

import h from "./lib/vnode";
import { render } from "./lib/render";

const App = h(
  "div",
  { style: "border: 2px solid pink;" },
  h("h1", null, "JDOM"),
  h(
    "button",
    {
      onClick: () => alert("Hello")
    },
    "Click me"
  )
);

render(App, document.getElementById("app"));
