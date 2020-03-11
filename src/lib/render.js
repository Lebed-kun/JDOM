import diff from "./diff";
import commitWork, { resetQueue, resolveQueue } from "./commit_work";

/**
 * @typedef {import('./vnode').VNode} VNode
 */

// Flag that blocks initializing work loop after 1st render
let initBlocked = false;

/**
 *
 * @param {VNode} vnode
 * @param {Element} $container
 */
export const render = (vnode, $container) => {
  if (!initBlocked) {
    resetQueue();
  }

  const taskQueue = resolveQueue();
  diff($container, vnode, null, taskQueue);

  if (!initBlocked) {
    initBlocked = true;
    commitWork();
  } else {
    taskQueue.push(() => (initBlocked = false));
  }
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
