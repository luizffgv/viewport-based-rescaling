import { html } from "Scripts/tags";
import styles from "./loading.css?sheet";

/** An animated loading throbber. */
export default class LoadingElement extends HTMLElement {
  static #template = html`
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle
        cx="50"
        cy="50"
        r="25"
        fill="none"
        stroke-width="5"
        stroke-linecap="round"
      />
    </svg>
  `;

  /** The component's shadow root but guaranteed to never be null. */
  #shadowRoot: ShadowRoot;

  constructor() {
    super();

    this.#shadowRoot = this.attachShadow({ mode: "closed" });

    this.#shadowRoot.adoptedStyleSheets.push(styles);

    this.#shadowRoot.innerHTML = LoadingElement.#template;
  }
}

customElements.define("x-loading", LoadingElement);

declare global {
  interface HTMLElementTagNameMap {
    "x-loading": LoadingElement;
  }
}
