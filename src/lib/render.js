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
 * @param {boolean?} hydrate
 */
export const render = (vnode, $container, hydrate = false) => {
  if (!initBlocked) {
    resetQueue();
  }

  const taskQueue = resolveQueue();
  diff($container, vnode, null, taskQueue, 0, hydrate);

  if (!initBlocked) {
    initBlocked = true;
    commitWork();
    taskQueue.push(() => (initBlocked = false));
  }
};

/**
 *
 * @param {VNode} vnode
 * @param {Element} $container
 */
export const hydrate = (vnode, $container) => render(vnode, $container, true);
