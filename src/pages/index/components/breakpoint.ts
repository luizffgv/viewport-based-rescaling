import { trySpecify } from "@luizffgv/ts-conversions";
import { html } from "Scripts/tags";
import styles from "./breakpoint.css?sheet";

/** Parameters for the construction of a {@link BreakpointElement}. */
type BreakpointElementParameters = {
  /** Initial value for the viewport value input. */
  viewportValue?: number;
  /** Initial value for the resulting value input. */
  resultingValue?: number;
};

/**
 * Represents a CSS rescaling keyframe.
 *
 * @remarks
 *
 * A rescaling keyframe is a mapping from a viewport size and a resulting size.
 */
export default class BreakpointElement extends HTMLElement {
  static #template = html`
    <div>
      <fieldset aria-label="Breakpoint">
        <label>
          <span
            >Viewport size
            <span class="small weak"
              >in <abbr title="pixels" aria-label="pixels">px</abbr></span
            ></span
          >
          <input type="number" id="input-viewport-value" placeholder="0" />
        </label>
        <label>
          <span
            >Resulting size
            <span class="small weak"
              >in <abbr title="pixels" aria-label="pixels">px</abbr></span
            ></span
          >
          <input type="number" id="input-resulting-value" placeholder="0" />
        </label>
      </fieldset>
      <button type="button" id="delete-button" aria-label="Delete breakpoint">
        <span class="material-symbols-outlined">delete</span>
      </button>
    </div>
  `;

  /** The component's shadow root but guaranteed to never be null. */
  #shadowRoot: ShadowRoot;

  /** The input element for the input viewport size. */
  #viewportValueInput: HTMLInputElement;

  /** The input element for the resulting output size. */
  #resultingValueInput: HTMLInputElement;

  /** The button element for deleting the breakpoint. */
  #deleteButtonElement: HTMLButtonElement;

  /** The input viewport size. */
  get viewportValue(): number {
    return Number.parseFloat(this.#viewportValueInput.value);
  }

  /** The resulting output size. */
  get resultingValue(): number {
    return Number.parseFloat(this.#resultingValueInput.value);
  }

  /**
   * Constructs a new {@link BreakpointElement}.
   *
   * @param parameters - Constructor parameters.
   */
  constructor(parameters?: BreakpointElementParameters) {
    super();

    this.#shadowRoot = this.attachShadow({ mode: "closed" });

    this.#shadowRoot.adoptedStyleSheets.push(styles);

    this.#shadowRoot.innerHTML = BreakpointElement.#template;

    this.#viewportValueInput = trySpecify(
      this.#shadowRoot.getElementById("input-viewport-value"),
      HTMLInputElement
    );

    if (parameters?.viewportValue != null)
      this.#viewportValueInput.value = String(parameters.viewportValue);

    this.#resultingValueInput = trySpecify(
      this.#shadowRoot.getElementById("input-resulting-value"),
      HTMLInputElement
    );
    if (parameters?.resultingValue != null)
      this.#resultingValueInput.value = String(parameters.resultingValue);

    this.#deleteButtonElement = trySpecify(
      this.#shadowRoot.getElementById("delete-button"),
      HTMLButtonElement
    );

    this.#deleteButtonElement.addEventListener(
      "click",
      () => {
        const despawn = new Animation(
          new KeyframeEffect(
            this,
            [
              {
                opacity: "1",
              },
              {
                opacity: "0",
              },
            ],
            { duration: 250, easing: "ease" }
          )
        );

        despawn.addEventListener("finish", () => {
          this.remove();
        });

        despawn.play();
      },
      { once: true }
    );
  }

  /**
   * Generates a CSS property value representing the interpolation between two
   * breakpoints.
   *
   * @param target - Second breakpoint.
   * @param clamp - How the value will be clamped.
   *   - `none` - no clamp.
   *   - `from` - prevents the value from scaling prior to the first point.
   *   - `to` - prevents the value from scaling past the second point.
   *   - `both` - combines `from` and `to`.
   *
   * @returns CSS code representing the value.
   */
  lerpTo(
    target: BreakpointElement,
    clamp: "none" | "from" | "to" | "both" = "none"
  ): string {
    const viewport = { from: this.viewportValue, to: target.viewportValue };
    const result = {
      from: this.resultingValue,
      to: target.resultingValue,
      min: Math.min(this.resultingValue, target.resultingValue),
      max: Math.max(this.resultingValue, target.resultingValue),
    };

    const d1 = result.to - result.from;
    const d2 = viewport.to - viewport.from;
    const m = d1 / d2;
    const n = result.from - viewport.from * m;

    const direction =
      d1 == 0 ? "constant" : d1 > 0 ? "increasing" : "decreasing";

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
}

customElements.define("x-breakpoint", BreakpointElement);

declare global {
  interface HTMLElementTagNameMap {
    "x-breakpoint": BreakpointElement;
  }
}
