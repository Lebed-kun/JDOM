/**
 *  Find nearest non-space node
 *
 * @param {Node} $node
 * @returns {Node}
 */
export const cleanNode = $node => {
  let currNode = $node;

  while (true) {
    if (
      currNode &&
      currNode.nodeValue &&
      currNode.nodeType === Node.TEXT_NODE &&
      !currNode.nodeValue.trim()
    ) {
      currNode = currNode.nextSibling;
    } else {
      return currNode;
    }
  }
};

/**
 *
 * @param {Node} $parent
 * @param {number} idx
 * @returns {Node}
 */
export const cleanChild = ($parent, idx) => {
  const childNodes = $parent.childNodes;
};
