import { trySpecify } from "@luizffgv/ts-conversions";
import { html } from "Scripts/tags";
import styles from "./breakpoint.css?sheet";
import Breakpoint from "../breakpoint";

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
export default class BreakpointElement
  extends HTMLElement
  implements Breakpoint
{
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
}

customElements.define("x-breakpoint", BreakpointElement);

declare global {
  interface HTMLElementTagNameMap {
    "x-breakpoint": BreakpointElement;
  }
}
