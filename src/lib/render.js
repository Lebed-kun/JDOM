import diff from "./diff";
import commitWork, { resolveQueue } from "./commit_work";

/**
 * @typedef {import('./vnode').VNode} VNode
 */

// Flag that blocks initializing work loop after 1st render
let initBlocked = false;
export const initUnblock = () => (initBlocked = false);

/**
 *
 * @param {VNode} vnode
 * @param {Element} $container
 * @param {boolean?} hydrate
 */
export const render = (vnode, $container, hydrate = false) => {
  const taskQueue = resolveQueue();
  diff($container, vnode, null, taskQueue, 0, hydrate);

  if (!initBlocked) {
    initBlocked = true;
    commitWork(); // Starts work loop
  }
};

/**
 *
 * @param {VNode} vnode
 * @param {Element} $container
 */
export const hydrate = (vnode, $container) => render(vnode, $container, true);
