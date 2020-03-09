import { isEmpty } from "./vnode";

const evtHandler = /^on/;

/**
 *
 * @param {Element} $element
 * @param {string} name
 * @param {any} value
 */
export const setAttribute = ($element, name, value) => {
  if (name === "className") {
    if (!isEmpty(value)) {
      $element.setAttribute("class", value);
    } else if ($element.hasAttribute("class")) {
      $element.removeAttribute("class");
    }
  } else if (evtHandler.test(name)) {
    if (typeof value === "function") {
      $element[`on${name.slice(2).toLowerCase()}`] = value;
    } else {
      $element[`on${name.slice(2).toLowerCase()}`] = null;
    }
  } else {
    if (!isEmpty(value) || value === true) {
      $element.setAttribute(name, value);
    } else if ($element.hasAttribute(name)) {
      $element.removeAttribute(name);
    }
  }
};

/**
 *
 * @param {Element} $element
 * @param {string} name
 */
export const removeAttribute = ($element, name) => {
  if (name === "className") {
    $element.removeAttribute("class");
  } else if (evtHandler.test(name)) {
    $element[`on${name.slice(2).toLowerCase()}`] = null;
  } else {
    $element.removeAttribute(name);
  }
};
