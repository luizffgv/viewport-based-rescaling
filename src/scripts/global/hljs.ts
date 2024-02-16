//
// Highlights all hardcoded CSS code blocks.
//

import hljs from "highlight.js/lib/core";

hljs.registerLanguage("css", require("highlight.js/lib/languages/css"));

document.addEventListener("DOMContentLoaded", () => {
  hljs.highlightAll();
});
