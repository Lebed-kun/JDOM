/**
 * @typedef {import('./vnode').VNode} VNode
 */

class Component {
  /**
   * @param {object?} props
   */
  constructor(props) {
    this.props = props || {};
    this.state = {};
  }

  /**
   * @param {object|object => object} newState
   */
  setState(newState) {
    if (typeof newState === "object") {
      this.state = newState;
    } else {
      this.state = newState(this.state);
    }
    // Rerender component
  }

  /**
   * @returns {VNode}
   */
  render() {
    // Return element tree
  }
}
