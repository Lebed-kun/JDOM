import { isEmpty, isText, isVElement, nodeType } from "./vnode";
import { forEach, filter } from "./utils";
import { setAttribute, removeAttribute } from "./props";
import { isClassCompNode } from "./component";

const elementActions = {
  INSERT: ($parent, newTree, taskQueue, idx = 0) => {
    taskQueue.push(() => {
      const newElement = isText(newTree)
        ? document.createTextNode(newTree)
        : document.createElement(newTree.type);
      $parent.insertBefore(newElement, $parent.childNodes[idx]);
    });
    return "INSERT";
  },
  REMOVE: ($parent, taskQueue, idx = 0) => {
    taskQueue.push(() => {
      $parent.removeChild($parent.childNodes[idx]);
    });
    return "REMOVE";
  },
  REPLACE: ($parent, newTree, taskQueue, idx = 0) => {
    taskQueue.push(() => {
      const newElement = isText(newTree)
        ? document.createTextNode(newTree)
        : document.createElement(newTree.type);
      $parent.replaceChild(newElement, $parent.childNodes[idx]);
    });
    return "REPLACE";
  },
  FUNC_COMP: (
    $parent,
    newTree,
    oldTree,
    taskQueue,
    idx = 0,
    hydrate = false
  ) => {
    taskQueue.push(() => {
      diff(
        $parent,
        newTree.type(newTree.props, newTree.ref),
        oldTree,
        taskQueue,
        idx,
        hydrate
      );
    });
    return "FUNC_COMP";
  },
  CLASS_COMP: (
    $parent,
    newTree,
    oldTree,
    taskQueue,
    idx = 0,
    hydrate = false
  ) => {}
};

const propsActions = {
  HYDRATE: ($parent, newProps, taskQueue, idx) => {
    const evtHandlers = filter(newProps, (_, name) => /^on/.test(name));
    forEach(evtHandlers, (value, name) => {
      taskQueue.push(() => {
        // Clean DOM child to avoid text nodes with empty content
        setAttribute($parent.childNodes[idx], name, value);
      });
    });
  },
  ADD_PROPS: ($parent, newProps, taskQueue, idx) => {
    forEach(newProps, (value, name) => {
      taskQueue.push(() => {
        setAttribute($parent.childNodes[idx], name, value);
      });
    });
  }
};

const childActions = {
  ADD_CHILD: ($parent, newChildren, taskQueue, idx, hydrate) => {
    newChildren.forEach((el, id) => {
      taskQueue.push(() => {
        diff($parent.childNodes[idx], el, null, taskQueue, id, hydrate);
      });
    });
  }
};

/**
 * @typedef {import('./vnode').VNode} VNode
 *
 * @param {Node} $parent Container DOM
 * @param {VNode} newTree
 * @param {VNode} oldTree
 * @param {Array<Function>} taskQueue
 * @param {number?} idx Index of current container's child
 * @param {boolean?} hydrate
 * @returns {["INSERT"|"REMOVE"|"REPLACE"|"FUNC_COMP"|undefined, VNode]}
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
    return elementActions["INSERT"]($parent, newTree, taskQueue, idx);
  }
  if (isEmpty(oldTree) && isVElement(newTree)) {
    if (!hydrate && typeof newTree.type === "string") {
      return elementActions["INSERT"]($parent, newTree, taskQueue, idx);
    } else if (isClassCompNode(newTree)) {
      return elementActions["CLASS_COMP"](
        $parent,
        newTree,
        oldTree,
        taskQueue,
        idx,
        hydrate
      );
    } else if (typeof newTree.type === "function") {
      return elementActions["FUNC_COMP"](
        $parent,
        newTree,
        oldTree,
        taskQueue,
        idx,
        hydrate
      );
    }
  }

  // Look for new tree
  if (isEmpty(newTree) && !isEmpty(oldTree)) {
    return elementActions["REMOVE"]($parent, taskQueue, idx);
  }

  // Compare two trees
  const newTreeType = nodeType(newTree);
  const oldTreeType = nodeType(oldTree);

  if (!hydrate && newTreeType !== oldTreeType && isText(newTree)) {
    return elementActions["REPLACE"]($parent, newTree, taskQueue, idx);
  }
  if (newTreeType !== oldTreeType && isVElement(newTree)) {
    if (!hydrate && typeof newTree.type === "string") {
      return elementActions["REPLACE"]($parent, newTree, taskQueue, idx);
    } else if (isClassCompNode(newTree)) {
      return elementActions["CLASS_COMP"](
        $parent,
        newTree,
        oldTree,
        taskQueue,
        idx,
        hydrate
      );
    } else if (typeof newTree.type === "function") {
      return elementActions["FUNC_COMP"](
        $parent,
        newTree,
        oldTree,
        taskQueue,
        idx,
        hydrate
      );
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
      return elementActions["REPLACE"]($parent, newTree, taskQueue, idx);
    } else if (isClassCompNode(newTree)) {
      return elementActions["CLASS_COMP"](
        $parent,
        newTree,
        oldTree,
        taskQueue,
        idx,
        hydrate
      );
    } else if (typeof newTree.type === "function") {
      return elementActions["FUNC_COMP"](
        $parent,
        newTree,
        oldTree,
        taskQueue,
        idx,
        hydrate
      );
    }
  }

  return [undefined, newTree];
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
      return propsActions["HYDRATE"]($parent, newProps, taskQueue, idx);
    }

    return propsActions["ADD_PROPS"]($parent, newProps, taskQueue, idx);
  }

  // Compare trees
  const newTreeType = nodeType(newTree);
  const oldTreeType = nodeType(oldTree);

  if (newTreeType !== oldTreeType && isVElement(newTree)) {
    if (hydrate && typeof newTree.type === "string") {
      return propsActions["HYDRATE"]($parent, newProps, taskQueue, idx);
    }

    return propsActions["ADD_PROPS"]($parent, newProps, taskQueue, idx);
  }
  if (newTreeType === "velement") {
    if (hydrate && typeof newTree.type === "string") {
      return propsActions["HYDRATE"]($parent, newProps, taskQueue, idx);
    }

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
  if (isEmpty(oldTree) && isVElement(newTree) && newChildren) {
    return childActions["ADD_CHILD"](
      $parent,
      newChildren,
      taskQueue,
      idx,
      hydrate
    );
  }

  // Compare two trees
  const newTreeType = nodeType(newTree);
  const oldTreeType = nodeType(oldTree);

  if (newTreeType !== oldTreeType && isVElement(newTree) && newChildren) {
    return childActions["ADD_CHILD"](
      $parent,
      newChildren,
      taskQueue,
      idx,
      hydrate
    );
  }
  if (newTreeType === "velement" && newChildren) {
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

  if (status !== "FUNC_COMP" && status !== "REMOVE") {
    diffProps($parent, newTree, oldTree, taskQueue, idx, hydrate);
    diffChildren($parent, newTree, oldTree, taskQueue, idx, hydrate);
  }

  return newTree;
};

export default diff;
