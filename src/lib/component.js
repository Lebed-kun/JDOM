import { isEmpty } from "./vnode";

/**
 * @typedef {import('./vnode').VNode} VNode
 */

/**
 * @class [Component Component]
 * @property {object} props
 * @property {object} state
 * @property {Element} _dom Container DOM node
 * @property {VNode} _tree
 */
class Component {
  /**
   * @param {object?} props
   */
  constructor(props) {
    this.props = props || {};
    this.state = {};
    this._dom = null;
    this._tree = null;
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
    // Rerender component like:
    // render(this.render(), this._dom, this._tree)
    // Then set current component's tree to new rendered tree
  }

  /**
   * @returns {VNode}
   */
  render() {
    // Return element tree
  }
}

/**
 *
 * @param {VNode} value
 * @returns {value is Component}
 */
export const isClassCompNode = value =>
  !isEmpty(value) && value.type.prototype === Component;
