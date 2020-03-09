/**
 *
 * @param {object} obj
 * @param {(any, number|string|symbol, object) => boolean} func
 * @returns {object}
 */
export const filter = (obj, func) => {
  const newObj = {};
  for (let key in obj) {
    if (func(obj[key], key, obj)) newObj[key] = obj[key];
  }
  return newObj;
};

/**
 *
 * @param {object} obj
 * @param {(any, number|string|symbol, object) => void} func
 */
export const forEach = (obj, func) => {
  for (let key in obj) {
    func(obj[key], key, obj);
  }
};
