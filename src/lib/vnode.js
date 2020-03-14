import { filter } from "./utils";

/**
 * @typedef {object} VElement
 * @property {string|Function} type
 * @property {object} props
 * @property {number|string|symbol?} key
 * @property {object} ref
 *
 * @typedef {string|number} Text
 * @typedef {undefined|null|boolean} Empty
 * @typedef {VElement|Text|Empty} VNode
 *
 * @param {string|(props : object?, ref : object?) => VNode} type
 * @param {object?} attrs
 * @param  {...any?} children
 * @returns {VElement}
 */
const h = (type, attrs, ...children) => {
  const normProps = attrs
    ? filter(attrs, (_, prop) => prop !== "key" && prop !== "ref")
    : {};

  if (children && children.length) normProps.children = children;

  return {
    type,
    props: normProps,
    key: attrs && attrs.key ? attrs.key : null,
    ref: attrs && attrs.ref ? attrs.ref : null
  };
};

/**
 * @param {any} value
 * @returns {value is Empty}
 */
export const isEmpty = value =>
  typeof value === "undefined" || typeof value === "boolean" || value === null;

/**
 * @param {any} value
 * @returns {value is Text}
 */
export const isText = value =>
  typeof value === "string" || typeof value === "number";

/**
 * @param {any} value
 * @returns {value is VElement}
 */
export const isVElement = value =>
  value &&
  (typeof value.type === "string" || typeof value.type === "function") &&
  value.props;

/**
 * @param {any} value
 * @returns {value is VNode}
 */
export const isVNode = value =>
  isEmpty(value) || isText(value) || isVElement(value);

/**
 *
 * @param {VNode} node
 * @returns {"empty"|"text"|"velement"|"unknown"}
 */
export const nodeType = node =>
  isEmpty(node)
    ? "empty"
    : isText(node)
    ? "text"
    : isVElement(node)
    ? "velement"
    : "unknown";

export default h;
