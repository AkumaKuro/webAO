export {escapeChat, unescapeChat}

const replace_table: Map<string, string> = new Map([
  ["#", "<num>"], ["&", "<and>"],
  ["%", "<percent>"], ["$", "<dollar>"]
])

/**
 * Escapes a string to AO1 escape codes.
 * @param {string} estring the string to be escaped
 */
function escapeChat(estring: string): string {
  for (const [key, value] of replace_table) {
    estring = estring.replaceAll(key, value)
  }
  return estring
}

/**
 * Unescapes a string to AO1 escape codes.
 * @param {string} estring the string to be unescaped
 */
function unescapeChat(estring: string): string {
  for (const [key, value] of replace_table) {
    estring = estring.replaceAll(value, key)
  }
  return estring
}

/**
 * Escapes a string to be HTML-safe.
 *
 * XXX: This is unnecessary if we use `createTextNode` instead!
 * @param {string} unsafe an unsanitized string
 */
export function safeTags(unsafe: string): string {
  if (unsafe) {
    return unsafe.replaceAll(">", "＞").replaceAll("<", "＜");
  }
  return "";
}

/**
 * Decodes text on client side.
 * @param {string} estring the string to be decoded
 */
export function decodeChat(estring: string): string {
  // Source: https://stackoverflow.com/questions/7885096/how-do-i-decode-a-string-with-escaped-unicode
  return estring.replace(/\\u([\d\w]{1,})/gi, (match, group) =>
    String.fromCharCode(parseInt(group, 16)),
  );
}

/**
 * XXX: a nasty hack made by gameboyprinter.
 * @param {string} msg chat message to prepare for display
 */
export function prepChat(msg: string): string {
  // TODO: make this less awful
  return safeTags(unescapeChat(decodeChat(msg)));
}
