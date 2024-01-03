//
// Provides no-op tag functions for formatting and syntax highlighting strings.
//

/**
 * No-op tag function to mark a string as HTML code.
 *
 * Some IDEs and extensions will properly format and highlight code inside this
 * tag.
 */
export function html(
  strings: TemplateStringsArray,
  ...values: unknown[]
): string {
  const valueStrings = values.map(String);
  // valStrings count could be one less than strings count, so we add a dummy
  // string
  valueStrings.push("");

  return strings
    .map((string, index) => string + valueStrings[index])
    .reduce((previous, current) => previous + current);
}

/**
 * No-op tag function to mark a string as CSS code.
 *
 * Some IDEs and extensions will properly format and highlight code inside this
 * tag.
 */
export function css(
  strings: TemplateStringsArray,
  ...values: unknown[]
): string {
  return html(strings, ...values);
}
