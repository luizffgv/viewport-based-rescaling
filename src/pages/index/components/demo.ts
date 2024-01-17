import { html } from "Scripts/tags";
import styles from "./demo.css?sheet";

/**
 * A demo showing how breakpoints work.
 */
export default class DemoElement extends HTMLElement {
  static #template = html`
    <div id="resizing-block">
      <span>The quick brown fox jumps over the lazy dog</span>
    </div>
    <div id="marker"></div>
  `;

  /** The component's shadow root but guaranteed to never be null. */
  #shadowRoot: ShadowRoot;

  constructor() {
    super();

    this.#shadowRoot = this.attachShadow({ mode: "closed" });

    this.#shadowRoot.adoptedStyleSheets.push(styles);

    this.#shadowRoot.innerHTML = DemoElement.#template;
  }

  connectedCallback() {
    this.setAttribute("aria-label", "Visual breakpoint example");
  }
}

customElements.define("x-demo", DemoElement);
