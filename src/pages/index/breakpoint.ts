/**
 * Represents a CSS rescaling breakpoint.
 */
export default interface Breakpoint {
  /** The input viewport size. */
  viewportValue: number;

  /** The resulting output size. */
  resultingValue: number;
}

/**
 * Generates a CSS property value representing the interpolation between two
 * breakpoints.
 *
 * @param source - First breakpoint.
 * @param target - Second breakpoint.
 * @param clamp - How the value will be clamped.
 *   - `none` - no clamp.
 *   - `from` - prevents the value from scaling prior to the first point.
 *   - `to` - prevents the value from scaling past the second point.
 *   - `both` - combines `from` and `to`.
 *
 * @returns CSS code representing the value.
 */
export function lerpBreakpoints(
  source: Breakpoint,
  target: Breakpoint,
  clamp: "none" | "from" | "to" | "both" = "none"
): string {
  const viewport = { from: source.viewportValue, to: target.viewportValue };
  const result = {
    from: source.resultingValue,
    to: target.resultingValue,
    min: Math.min(source.resultingValue, target.resultingValue),
    max: Math.max(source.resultingValue, target.resultingValue),
  };

  const d1 = result.to - result.from;
  const d2 = viewport.to - viewport.from;
  const m = d1 / d2;
  const n = result.from - viewport.from * m;

  const direction = d1 == 0 ? "constant" : d1 > 0 ? "increasing" : "decreasing";

  let code = `${+n.toFixed(2)}px + ${+(m * 100).toFixed(2)}vw`;

  if (direction == "constant" || clamp == "none") code = `calc(${code})`;
  else if (clamp == "both")
    code = `clamp(${result.min}px, ${code}, ${result.max}px)`;
  else if (
    (clamp == "from" && direction == "increasing") ||
    (clamp == "to" && direction == "decreasing")
  )
    code = `max(${result.min}px, ${code})`;
  else code = `min(${result.max}px, ${code})`;

  return code;
}
