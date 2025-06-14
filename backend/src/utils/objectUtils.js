/**
 * Utility functions for object operations
 */

/**
 * Extends the destination object with properties from the source object
 * This is a replacement for the deprecated util._extend
 * 
 * @param {Object} dest - The destination object
 * @param {Object} src - The source object
 * @returns {Object} - The extended destination object
 */
const extend = (dest, src) => {
  return Object.assign(dest, src);
};

/**
 * Deep merges two objects
 * 
 * @param {Object} target - The target object
 * @param {Object} source - The source object
 * @returns {Object} - The merged object
 */
const deepMerge = (target, source) => {
  const output = Object.assign({}, target);
  
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  
  return output;
};

/**
 * Checks if value is an object
 * 
 * @param {*} item - The item to check
 * @returns {boolean} - True if the item is an object
 */
const isObject = (item) => {
  return (item && typeof item === 'object' && !Array.isArray(item));
};

module.exports = {
  extend,
  deepMerge,
  isObject
};