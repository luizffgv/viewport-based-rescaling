//
// Displays a loading throbber while the page is loading.
//

import LoadingElement from "Scripts/components/loading";

const loadingOverlay = document.createElement("div");
loadingOverlay.style.position = "fixed";
loadingOverlay.style.inset = "0";
loadingOverlay.style.background = "var(--color-bg)";

const loadingElement = new LoadingElement();
loadingElement.style.position = "absolute";
loadingElement.style.left = "50%";
loadingElement.style.top = "50%";
loadingElement.style.translate = "-50% -50%";
loadingElement.style.height = "128px";
loadingElement.style.width = "128px";
loadingOverlay.style.zIndex = "1";
loadingOverlay.append(loadingElement);

const bodyObserver = new MutationObserver(() => {
  if (document.body) {
    document.body.append(loadingOverlay);
    bodyObserver.disconnect();
  }
});
bodyObserver.observe(document.documentElement, { childList: true });

window.addEventListener("load", () => {
  const fadeOut = new Animation(
    new KeyframeEffect(loadingOverlay, [{ opacity: "1" }, { opacity: "0" }], {
      duration: 250,
    })
  );
  fadeOut.addEventListener("finish", () => loadingOverlay.remove());
  fadeOut.play();
});
