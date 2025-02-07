import { fireToast } from "../helpers/fireToast";

export function makeSwatchValueCopyable() {
  // $(".swatch").attr("title", "Click to copy");
  document.querySelectorAll(".swatch").forEach((swatch) => {
    swatch.setAttribute("title", "Click to copy");

    swatch.addEventListener("click", () => {
      const valwrapper = swatch.querySelector(".value") as HTMLSpanElement;
      if (!valwrapper) return;
      const value = String(valwrapper.textContent).trim();
      navigator.clipboard.writeText(value).then(
        () => {
          console.log("Async: Copying to clipboard was successful!");
          fireToast("Color was copied to clipboard");
        },
        (err) => {
          console.error("Async: Could not copy text: ", err);
          fireToast("🤨 Error copying color to clipboard");
        },
      );
    });
  });
  // $(".swatch").on("click", (event) => {
  //   const swatch = event.currentTarget as HTMLElement;
  //   const valwrapper = swatch.querySelector(".value") as HTMLSpanElement;
  //   if (!valwrapper) return;
  //   const value = String(valwrapper.textContent).trim();
  //   navigator.clipboard.writeText(value).then(
  //     () => {
  //       console.log("Async: Copying to clipboard was successful!");
  //       fireToast("Color was copied to clipboard");
  //     },
  //     (err) => {
  //       console.error("Async: Could not copy text: ", err);
  //       fireToast("🤨 Error copying color to clipboard");
  //     },
  //   );
  // });
}
