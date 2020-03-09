import diff from "./diff";
import commitWork, { resetQueue, resolveQueue } from "./commit_work";

/**
 * @typedef {import('./vnode').VNode} VNode
 */

/**
 *
 * @param {VNode} vnode
 * @param {Element} $container
 */
export const render = (vnode, $container) => {
  resetQueue();
  diff($container, vnode, null, resolveQueue());
  commitWork();
};

/**
 *
 * @param {VNode} vnode
 * @param {Element} $container
 */
export const hydrate = (vnode, $container) => {
  resetQueue();
  diff($container, vnode, null, resolveQueue(), 0, true);
  commitWork();
};
