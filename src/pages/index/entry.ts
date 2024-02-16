import { throwIfNull, trySpecify } from "@luizffgv/ts-conversions";
import "./components/breakpoint";
import "./styles.css?apply";
import BreakpointElement from "./components/breakpoint";
import "./components/demo";
import hljs from "highlight.js/lib/core";
import Breakpoint, { lerpBreakpoints } from "./breakpoint";

hljs.registerLanguage("css", require("highlight.js/lib/languages/css"));

document.addEventListener("DOMContentLoaded", () => {
  /**
   * Generates CSS code for setting a property's values given a list of
   * breakpoints.
   *
   * @param property - Property to set.
   * @param breakpoints - Breakpoints used.
   * @returns Generated code.
   */
  function generateCode(property: string, breakpoints: Breakpoint[]): string {
    // Check if the property name is not empty.
    if (property.length == 0) return "/* Specify a property name. */";

    // Check if there are enough breakpoints.
    if (breakpoints.length < 2) return "/* Add more breakpoints. */";

    // Check if all breakpoints have all inputs filled.
    if (
      breakpoints.some(
        ({ viewportValue, resultingValue }) =>
          Number.isNaN(viewportValue) || Number.isNaN(resultingValue)
      )
    )
      return "/* Fill in all fields. */";

    // Check if all breakpoints have positive viewport values.
    if (breakpoints.some(({ viewportValue }) => viewportValue < 0))
      return "/* Make sure viewport values are positive. */";

    // Check if breakpoints are in ascending order.
    if (
      breakpoints.some(
        ({ viewportValue }, index) =>
          viewportValue <= (breakpoints[index - 1]?.viewportValue ?? -1)
      )
    )
      return "/* Make sure viewport values are in ascending order. */";

    // Check if all viewport values are integers.
    if (
      breakpoints.some(({ viewportValue }) => !Number.isInteger(viewportValue))
    )
      return "/* Viewport values must be integers. */";

    let code = "";
    let comment = "";

    // prettier-ignore
    comment += `/* Interpolates ${property} from ${breakpoints[0]?.resultingValue}px to ${ breakpoints.at(-1)?.resultingValue}px
 * based on the following steps:
 * ${breakpoints[0]?.resultingValue}px at ${breakpoints[0]?.viewportValue}px viewport width`;

    for (let index = 1; index < breakpoints.length; ++index) {
      const last = breakpoints[index - 1]!;
      const current = breakpoints[index]!;

      comment += `
 * ${current.resultingValue}px at ${current.viewportValue}px viewport width`;

      if (breakpoints.length == 2) {
        code += `\n${property}: ${lerpBreakpoints(last, current, "both")};`;
      } else if (index == 1) {
        code += `\n${property}: ${lerpBreakpoints(last, current, "from")};`;
      } else if (index == breakpoints.length - 1) {
        code += `
@media screen and (min-width: ${last.viewportValue}px) {
  ${property}: ${lerpBreakpoints(last, current, "to")};
}`;
      } else {
        code += `
@media screen and (min-width: ${last.viewportValue}px) {
  ${property}: ${lerpBreakpoints(last, current)};
}`;
      }
    }

    comment += "\n */";

    return comment + code;
  }

  /**
   * Generates and updates the CSS code resulting from the specified breakpoints.
   *
   * @param localElements - Necessary HTML elements.
   */
  function updateCode({
    breakpointContainer,
    outputCode,
    propertyInput,
  }: Pick<
    typeof elements,
    "breakpointContainer" | "outputCode" | "propertyInput"
  >): void {
    const breakpoints = [
      ...breakpointContainer.getElementsByTagName("x-breakpoint"),
    ];

    const code = generateCode(propertyInput.value, breakpoints);

    outputCode.innerHTML = hljs.highlight("css", code).value;
  }

  /**
   * Sets up listeners to update the generated CSS code when parameters change.
   *
   * @param localElements - Necessary HTML elements.
   */
  function setupParameterChangeListeners(
    localElements: Pick<
      typeof elements,
      "breakpointContainer" | "outputCode" | "propertyInput"
    >
  ): void {
    // Update output code when parameters change
    for (const element of [
      localElements.propertyInput,
      localElements.breakpointContainer,
    ])
      element.addEventListener("input", () => updateCode(localElements));
    const observer = new MutationObserver(() => updateCode(localElements));
    observer.observe(localElements.breakpointContainer, { childList: true });
  }

  /**
   * Makes it so that a breakpoint is added whenever the add button is pressed.
   *
   * @param localElements - Necessary HTML elements.
   */
  function setupAddBreakpointButton(
    localElements: Pick<
      typeof elements,
      "addBreakpointButton" | "breakpointContainer"
    >
  ) {
    localElements.addBreakpointButton.addEventListener("click", () => {
      const breakpoint = new BreakpointElement();

      const listItem = document.createElement("li");
      listItem.append(breakpoint);

      // Delete list item on breakpoint removal
      const observer = new MutationObserver(() => listItem.remove());
      observer.observe(listItem, { childList: true });

      localElements.breakpointContainer.append(listItem);
    });
  }

  /**
   * Sets up the help dialog open/close functionality.
   *
   * @param localElements - Necessary HTML elements.
   */
  function setupHelpDialog(
    localElements: Pick<
      typeof elements,
      "helpButton" | "helpDialog" | "helpDialogCloseButton"
    >
  ) {
    localElements.helpButton.addEventListener("click", () => {
      localElements.helpDialog.showModal();
    });

    localElements.helpDialogCloseButton.addEventListener("click", () => {
      localElements.helpDialog.close();
    });
  }

  const elements = {
    propertyInput: trySpecify(
      document.getElementById("property-input"),
      HTMLInputElement
    ),
    breakpointContainer: throwIfNull(
      document.getElementById("breakpoint-container")
    ),
    addBreakpointButton: trySpecify(
      document.getElementById("add-breakpoint-button"),
      HTMLButtonElement
    ),
    outputCode: throwIfNull(document.getElementById("output-code")),
    helpDialog: trySpecify(
      document.getElementById("help-dialog"),
      HTMLDialogElement
    ),
    helpButton: trySpecify(
      document.getElementById("help-button"),
      HTMLButtonElement
    ),
    helpDialogCloseButton: trySpecify(
      document.getElementById("help-dialog-close-button"),
      HTMLButtonElement
    ),
  };

  setupParameterChangeListeners(elements);
  setupAddBreakpointButton(elements);
  setupHelpDialog(elements);

  // Show initial code
  updateCode(elements);
});
