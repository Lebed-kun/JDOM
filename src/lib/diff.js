import { isEmpty, isText, isVElement, nodeType } from "./vnode";
import { forEach, filter } from "./utils";
import { setAttribute, removeAttribute } from "./props";

/**
 * @typedef {import('./vnode').VNode} VNode
 *
 * @param {Node} $parent Container DOM
 * @param {VNode} newTree
 * @param {VNode} oldTree
 * @param {Array<Function>} taskQueue
 * @param {number?} idx Index of current container's child
 * @param {boolean?} hydrate
 * @returns {"INSERT"|"REMOVE"|"REPLACE"|undefined}
 */
const diffElement = (
  $parent,
  newTree,
  oldTree,
  taskQueue,
  idx = 0,
  hydrate = false
) => {
  // Look for old tree
  if (!hydrate && isEmpty(oldTree) && isText(newTree)) {
    taskQueue.push(() => {
      const newElement = document.createTextNode(newTree);
      $parent.insertBefore(newElement, $parent.childNodes[idx]);
    });
    return "INSERT";
  }
  if (isEmpty(oldTree) && isVElement(newTree)) {
    if (!hydrate && typeof newTree.type === "string") {
      taskQueue.push(() => {
        const newElement = document.createElement(newTree.type);
        $parent.insertBefore(newElement, $parent.childNodes[idx]);
      });
      return "INSERT";
    } else {
      // TODO: add task for functional component
    }
  }

  // Look for new tree
  if (isEmpty(newTree) && isText(oldTree)) {
    taskQueue.push(() => {
      $parent.removeChild($parent.childNodes[idx]);
    });
    return "REMOVE";
  }
  if (isEmpty(newTree) && isVElement(oldTree)) {
    if (typeof oldTree.type === "string") {
      taskQueue.push(() => {
        $parent.removeChild($parent.childNodes[idx]);
      });
      return "REMOVE";
    } else {
      // TODO: add task for functional component
    }
  }

  // Compare two trees
  const newTreeType = nodeType(newTree);
  const oldTreeType = nodeType(oldTree);

  if (!hydrate && newTreeType !== oldTreeType && isText(newTree)) {
    taskQueue.push(() => {
      const newElement = document.createTextNode(newTree);
      $parent.replaceChild(newElement, $parent.childNodes[idx]);
    });
    return "REPLACE";
  }
  if (newTreeType !== oldTreeType && isVElement(newTree)) {
    if (!hydrate && typeof newTree.type === "string") {
      taskQueue.push(() => {
        const newElement = document.createElement(newTree.type);
        $parent.replaceChild(newElement, $parent.childNodes[idx]);
      });
      return "REPLACE";
    } else {
      // TODO: add task for functional component
    }
  }
  if (!hydrate && newTreeType === "text" && newTree !== oldTree) {
    taskQueue.push(() => {
      $parent.childNodes[idx].nodeValue = newTree;
    });
    return "REPLACE";
  }
  if (
    newTreeType === "velement" &&
    (hydrate || newTree.type !== oldTree.type)
  ) {
    if (!hydrate && typeof newTree.type === "string") {
      taskQueue.push(() => {
        const newElement = document.createElement(newTree.type);
        $parent.replaceChild(newElement, $parent.childNodes[idx]);
      });
      return "REPLACE";
    } else {
      // TODO: add task for functional component
    }
  }
};

/**
 * @param {Node} $parent Container DOM
 * @param {VNode} newTree
 * @param {VNode} oldTree
 * @param {Array<Function>} taskQueue
 * @param {number?} idx Index of current container's child
 * @param {boolean?} hydrate
 */
const diffProps = (
  $parent,
  newTree,
  oldTree,
  taskQueue,
  idx = 0,
  hydrate = false
) => {
  const newProps = isVElement(newTree)
    ? filter(newTree.props, (_, name) => name !== "children")
    : null;
  const oldProps = isVElement(oldTree)
    ? filter(oldTree.props, (_, name) => name !== "children")
    : null;

  // Look for old tree
  if (isEmpty(oldTree) && isVElement(newTree)) {
    if (hydrate && typeof newTree.type === "string") {
      const evtHandlers = filter(newProps, (_, name) => /^on/.test(name));
      forEach(evtHandlers, (value, name) => {
        taskQueue.push(() => {
          console.log($parent);
          setAttribute($parent.childNodes[idx], name, value);
        });
      });
      return;
    }

    if (typeof newTree.type === "string") {
      forEach(newProps, (value, name) => {
        taskQueue.push(() => {
          setAttribute($parent.childNodes[idx], name, value);
        });
      });
      return;
    } else {
      // TODO: add task for functional component
    }
  }

  // Compare trees
  const newTreeType = nodeType(newTree);
  const oldTreeType = nodeType(oldTree);

  if (newTreeType !== oldTreeType && isVElement(newTree)) {
    if (hydrate && typeof newTree.type === "string") {
      const evtHandlers = filter(newProps, (_, name) => /^on/.test(name));
      forEach(evtHandlers, (value, name) => {
        taskQueue.push(() => {
          setAttribute($parent.childNodes[idx], name, value);
        });
      });
      return;
    }

    if (typeof newTree.type === "string") {
      forEach(newProps, (value, name) => {
        taskQueue.push(() => {
          setAttribute($parent.childNodes[idx], name, value);
        });
      });
      return;
    } else {
      // TODO: add task for functional component
    }
  }
  if (newTreeType === "velement") {
    if (hydrate && typeof newTree.type === "string") {
      const evtHandlers = filter(newProps, (_, name) => /^on/.test(name));
      forEach(evtHandlers, (value, name) => {
        taskQueue.push(() => {
          setAttribute($parent.childNodes[idx], name, value);
        });
      });
      return;
    }

    if (typeof newTree.type === "string") {
      // Look for old props
      forEach(oldProps, (_, name) => {
        if (isEmpty(newProps[name]) && newProps[name] !== true) {
          taskQueue.push(() => {
            removeAttribute($parent.childNodes[idx], name);
          });
        }
      });

      // Look for new props
      forEach(newProps, (value, name) => {
        if (value !== oldProps[name]) {
          taskQueue.push(() => {
            setAttribute($parent.childNodes[idx], name, value);
          });
        }
      });
      return;
    } else {
      // TODO: add task for functional component
    }
  }
};

/**
 * @param {Node} $parent
 * @param {VNode} newTree
 * @param {VNode} oldTree
 * @param {Array<Function>} taskQueue
 * @param {number?} idx
 * @param {boolean?} hydrate
 */
const diffChildren = (
  $parent,
  newTree,
  oldTree,
  taskQueue,
  idx = 0,
  hydrate = false
) => {
  const newChildren = isVElement(newTree) ? newTree.props.children : null;
  const oldChildren = isVElement(oldTree) ? oldTree.props.children : null;

  // Look for old tree
  if (isEmpty(oldTree) && isVElement(newTree)) {
    if (typeof newTree.type === "string" && newChildren) {
      newChildren.forEach((el, id) => {
        taskQueue.push(() => {
          diff($parent.childNodes[idx], el, null, taskQueue, id, hydrate);
        });
      });
      return;
    } else {
      // TODO : scheduling tasks for functional components
    }
  }

  // Compare two trees
  const newTreeType = nodeType(newTree);
  const oldTreeType = nodeType(oldTree);

  if (newTreeType !== oldTreeType && isVElement(newTree)) {
    if (typeof newTree.type === "string" && newChildren) {
      newChildren.forEach((el, id) => {
        taskQueue.push(() => {
          diff($parent.childNodes[idx], el, null, taskQueue, id, hydrate);
        });
      });
      return;
    } else {
      // TODO : scheduling tasks for functional components
    }
  }
  if (newTreeType === "velement") {
    if (typeof newTree.type === "string" && newChildren) {
      // To compare pairs of existent nodes
      const minChdCount = Math.min(
        newChildren ? newChildren.length : 0,
        oldChildren ? oldChildren.length : 0
      );
      // Look for old children
      (oldChildren || []).forEach((el, id) => {
        taskQueue.push(() => {
          diff(
            $parent.childNodes[idx],
            newChildren[id],
            el,
            taskQueue,
            id,
            hydrate
          );
        });
      });
      // Look for new children
      (newChildren || []).forEach(
        (el, id) =>
          id >= minChdCount &&
          taskQueue.push(() => {
            diff($parent.childNodes[idx], el, null, taskQueue, id, hydrate);
          })
      );
      return;
    } else {
      // TODO : scheduling tasks for functional components
    }
  }
};

/**
 * @param {Node} $parent
 * @param {VNode} newTree
 * @param {VNode} oldTree
 * @param {Array<Function>} taskQueue
 * @param {number?} idx
 * @param {boolean?} hydrate
 */
const diff = (
  $parent,
  newTree,
  oldTree,
  taskQueue,
  idx = 0,
  hydrate = false
) => {
  const status = diffElement(
    $parent,
    newTree,
    oldTree,
    taskQueue,
    idx,
    hydrate
  );

  if (status !== "REMOVE") {
    diffProps($parent, newTree, oldTree, taskQueue, idx, hydrate);
    diffChildren($parent, newTree, oldTree, taskQueue, idx, hydrate);
  }
};

export default diff;
