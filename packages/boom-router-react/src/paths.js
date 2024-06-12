/**
 * Transforms a given path into its relative version based on a base path.
 * If the base path isn't part of the provided path, it returns the absolute path prefixed with '~'.
 *
 * @param {string} [base=""] - The base path.
 * @param {string} path - The path to be transformed.
 * @returns {string} The relative path.
 */
export const transformToRelativePath = (base = "", path) => {
  const isBasePartOfPath = !path.toLowerCase().startsWith(base.toLowerCase());
  return isBasePartOfPath ? path.slice(base.length) || "/" : "~" + path;
};

/**
 * Transforms a given path into its absolute version based on a base path.
 * If the path starts with '~', it removes the '~' and returns the rest of the path.
 *
 * @param {string} to - The path to be transformed.
 * @param {string} [base=""] - The base path.
 * @returns {string} The absolute path.
 */
export const transformToAbsolutePath = (to, base = "") => {
  return to.startsWith("~") ? to.slice(1) : base + to;
};

/**
 * Removes the leading question mark from a string.
 *
 * @param {string} str - The string to be transformed.
 * @returns {string} The string without the leading question mark.
 */
export const removeLeadingQuestionMark = (str) => {
  return str.startsWith("?") ? str.slice(1) : str;
};

/**
 * Decodes escape sequences such as %20 in a string.
 * If the string can't be decoded, it returns the original string.
 *
 * @param {string} str - The string to be decoded.
 * @returns {string} The decoded string.
 */
export const decodeEscapeSequences = (str) => {
  try {
    return decodeURI(str);
  } catch (_e) {
    // fail-safe mode: if string can't be decoded do nothing
    return str;
  }
};
