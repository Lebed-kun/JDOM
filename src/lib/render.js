import diff from "./diff";

/**
 * @typedef {import('./vnode').VNode} VNode
 */

/**
 *
 * @param {VNode} vnode
 * @param {Element} $container
 * @param {VNode?} oldNode
 * @param {boolean?} hydrate
 */
export const render = (vnode, $container, oldNode = null, hydrate = false) => {
  diff($container, vnode, oldNode, 0, hydrate);
};

/**
 *
 * @param {VNode} vnode
 * @param {Element} $container
 */
export const hydrate = (vnode, $container) =>
  render(vnode, $container, null, true);
