import { createCSSRootExport } from "./main";

export function copyCSSVarsToClipboard() {
  const CSSRootString = createCSSRootExport();
  navigator.clipboard.writeText(CSSRootString).then(
    function () {
      console.log("Async: Copying to clipboard was successful!");
    },
    function (err) {
      console.error("Async: Could not copy text: ", err);
    },
  );
}
