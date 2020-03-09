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
 * @returns {"INSERT"|"REMOVE"|"REPLACE"|undefined}
 */
const diffElement = ($parent, newTree, oldTree, taskQueue, idx = 0) => {
  // Look for old tree
  if (isEmpty(oldTree) && isText(newTree)) {
    taskQueue.push(() => {
      const newElement = document.createTextNode(newTree);
      $parent.insertBefore(newElement, $parent.childNodes[idx]);
    });
    return "INSERT";
  }
  if (isEmpty(oldTree) && isVElement(newTree)) {
    if (typeof newTree.type === "string") {
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

  if (newTreeType !== oldTreeType && isText(newTree)) {
    taskQueue.push(() => {
      const newElement = document.createTextNode(newTree);
      $parent.replaceChild(newElement, $parent.childNodes[idx]);
    });
    return "REPLACE";
  }
  if (newTreeType !== oldTreeType && isVElement(newTree)) {
    if (typeof newTree.type === "string") {
      taskQueue.push(() => {
        const newElement = document.createElement(newTree.type);
        $parent.replaceChild(newElement, $parent.childNodes[idx]);
      });
      return "REPLACE";
    } else {
      // TODO: add task for functional component
    }
  }
  if (newTreeType === "text" && newTree !== oldTree) {
    taskQueue.push(() => {
      const newElement = document.createTextNode(newTree);
      $parent.replaceChild(newElement, $parent.childNodes[idx]);
    });
    return "REPLACE";
  }
  if (newTreeType === "velement" && newTree.type !== oldTree.type) {
    if (typeof newTree.type === "string") {
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
 */
const diffProps = ($parent, newTree, oldTree, taskQueue, idx = 0) => {
  const newProps = isVElement(newTree)
    ? filter(newTree.props, (_, name) => name !== "children")
    : null;
  const oldProps = isVElement(oldTree)
    ? filter(oldTree.props, (_, name) => name !== "children")
    : null;

  // Look for old tree
  if (isEmpty(oldTree) && isVElement(newTree)) {
    if (typeof newTree.type === "string") {
      forEach(newProps, (value, name) => {
        taskQueue.push(() => {
          setAttribute($parent.children[idx], name, value);
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
    if (typeof newTree.type === "string") {
      forEach(newProps, (value, name) => {
        taskQueue.push(() => {
          setAttribute($parent.children[idx], name, value);
        });
      });
      return;
    } else {
      // TODO: add task for functional component
    }
  }
  if (newTreeType === "velement") {
    if (typeof newTree.type === "string") {
      // Look for old props
      forEach(oldProps, (_, name) => {
        if (isEmpty(newProps[name]) && newProps[name] !== true) {
          taskQueue.push(() => {
            removeAttribute($parent.children[idx], name);
          });
        }
      });

      // Look for new props
      forEach(newProps, (value, name) => {
        if (value !== oldProps[name]) {
          taskQueue.push(() => {
            setAttribute($parent.children[idx], name, value);
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
 */
const diff = ($parent, newTree, oldTree, taskQueue, idx = 0) => {
  const status = diffElement($parent, newTree, oldTree, taskQueue, idx);

  if (status !== "REMOVE") {
    diffProps($parent, newTree, oldTree, taskQueue, idx);
  }
};
