import chroma from "chroma-js";
import $ from "jquery";
import { adjustLuminanceToContrast } from "./adjustLuminanceToContrast";
import { decreaseOpacityToContrast } from "./decreaseOpacityToContrast";
import { setSaturation } from "./setSaturation";

const wcagNonContentContrast = 3;
const wcagContentContrast = 4.5;
// const root = document.documentElement
const whiteColor = "#FFF";
const blackColor = "#000";

// Empty color object for export
const CSSVarsStore = { light: new Map(), dark: new Map() };

let initOnce = false;

// Insert the random color value into the text field
function generateRandomColor() {
  const randomColor = chroma.random().hex().toUpperCase();
  $("#accentColor").val(randomColor);
  $("#accentColor")
    .parent()
    .find(".mini-swatch")
    .css("background-color", randomColor);
}

export function init() {
  if (initOnce) return;
  initOnce = true;
  generateRandomColor();
  generatePalette();
  makeSwatchValueCopyable();

  $("#generateBtn").on("click", function (e) {
    generatePalette();
    e.preventDefault();
  });

  $("#exportBtn").on("click", function (e) {
    e.preventDefault();
    copyCSSVarsToClipboard();
    // Display a toast message
    fireToast("CSS variables copied to clipboard");
  });

  $("#lightModeBtn").on("click", function (e) {
    e.preventDefault();
    $("html").attr("data-theme", "light");
    $(this).attr("data-state", "on");
    $("#darkModeBtn").attr("data-state", "off");
    setSwatchValues("light");
    $("link[rel*='icon']").attr(
      "href",
      "/images/favicons/light/favicon-16x16.png",
    );
  });

  $("#darkModeBtn").on("click", function (e) {
    e.preventDefault();
    $("html").attr("data-theme", "dark");
    $(this).attr("data-state", "on");
    $("#lightModeBtn").attr("data-state", "off");
    setSwatchValues("dark");
    $("link[rel*='icon']").attr(
      "href",
      "/images/favicons/dark/favicon-16x16.png",
    );
  });

  $("#randomColorBtn").on("click", function (e) {
    generateRandomColor();
    e.preventDefault();
  });

  $("#tryBrandColor a").on("click", function (e) {
    var brandColor = $(this).attr("data-color-value") as string;
    $("#accentColor").val(brandColor);
    $("#accentColor")
      .parent()
      .find(".mini-swatch")
      .css("background-color", brandColor);
    e.preventDefault();
  });

  $("#accentColor").on("change", function (e: Event) {
    var color = $(e.target as HTMLElement).val() as string;
    $("#accentColor")
      .parent()
      .find(".mini-swatch")
      .css("background-color", color);
  });
}

function makeSwatchValueCopyable() {
  $(".swatch").on("click", (event) => {
    const swatch = event.currentTarget as HTMLElement;
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
}

function fireToast(message: string) {
  const toast = document.createElement("ui-toast");
  toast.textContent = message;
  document.body.appendChild(toast);
}

// Re-displ
function setSwatchValues(theme: "light" | "dark") {
  $(".swatch").each(function () {
    var $value = $(this).find(".value");
    $value.text(String($(this).attr(`data-${theme}-color`)));
  });
}

function setCssColor(
  theme: "light" | "dark",
  swatchId: string,
  cssVariable: string,
  color: string,
) {
  const styleElement: HTMLStyleElement =
    document.head.querySelector(`style[data-theme="${theme}"]`) ||
    createThemeStyle(theme);
  styleElement.sheet?.insertRule(
    `[data-theme="${theme}"] { ${cssVariable}: ${color}; }`,
    styleElement.sheet.cssRules.length,
  ); // Declare CSS variables in head's style element
  CSSVarsStore[theme].set(cssVariable, color); // Store color in color map for export later
  var $swatch = $(`#${swatchId}`); // Get the swatch
  $swatch.attr(`data-${theme}-color`, color); // Ensure swatch remembers light/dark mode color
  // $swatch.find('.value').text(color); // Display the color value in the swatch
}

function createCSSRootExport() {
  const lightVars = Array.from(CSSVarsStore.light.entries());
  const combined = lightVars.map((item) => [
    ...item,
    CSSVarsStore.dark.get(item[0]),
  ]);
  const cssRootSelectorString = `:root {\n${combined
    .map(
      ([key, value1, value2]) =>
        `\t--${key}: light-dark(${value1}, ${value2});`,
    )
    .join("\n")}\n}`;
  return cssRootSelectorString;
}

function copyCSSVarsToClipboard() {
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

// Create theme in head's style element
function createThemeStyle(theme: "light" | "dark") {
  const style = document.createElement("style");
  style.setAttribute("data-theme", theme);
  document.head.appendChild(style);
  return style;
}

function generatePalette() {
  const accentColor = ($("#accentColor").val() as string).trim();
  const canvasContrast = +($("#canvasContrast").val() as string).trim();
  const cardContrast = +($("#cardContrast").val() as string).trim();
  const softContrast = +($("#softContrast").val() as string).trim();
  const strongContrast = +($("#strongContrast").val() as string).trim();
  const neutralSaturation = +($("#neutralSaturation").val() as string).trim();
  const neutralContrast = +($("#neutralContrast").val() as string).trim();
  const darkModeSaturation = +($("#darkModeSaturation").val() as string).trim();

  // **********
  // LIGHT MODE
  // **********

  // Establish light mode seed color
  var lightSeedColor = accentColor;
  setCssColor("light", "seed", "--color-seed", lightSeedColor.toUpperCase());

  // Establish light mode background colors
  var lightCanvasColor = adjustLuminanceToContrast(
    lightSeedColor,
    whiteColor,
    canvasContrast,
  );
  setCssColor("light", "canvas", "--color-canvas", lightCanvasColor);
  var lightCardColor = adjustLuminanceToContrast(
    lightSeedColor,
    whiteColor,
    cardContrast,
  );
  setCssColor("light", "card", "--color-card", lightCardColor);

  // Establish light mode accent baseline colors
  var lightAccentNonContentBaselineColor = adjustLuminanceToContrast(
    lightSeedColor,
    lightCardColor,
    wcagNonContentContrast,
  );
  setCssColor(
    "light",
    "accentNonContentBaseline",
    "--color-accentNonContentBaseline",
    lightAccentNonContentBaselineColor,
  );
  var lightAccentContentBaselineColor = adjustLuminanceToContrast(
    lightSeedColor,
    lightCardColor,
    wcagContentContrast,
  );
  setCssColor(
    "light",
    "accentContentBaseline",
    "--color-accentContentBaseline",
    lightAccentContentBaselineColor,
  );

  // Establish light mode accent non-content colors
  var lightAccentNonContentStrongColor = adjustLuminanceToContrast(
    lightAccentNonContentBaselineColor,
    lightAccentNonContentBaselineColor,
    strongContrast,
    "decrease",
  );
  setCssColor(
    "light",
    "accentNonContentStrong",
    "--color-accentNonContentStrong",
    lightAccentNonContentStrongColor,
  );
  var lightAccentNonContentSubduedColor = decreaseOpacityToContrast(
    lightAccentNonContentStrongColor,
    lightCardColor,
    wcagNonContentContrast,
  );
  setCssColor(
    "light",
    "accentNonContentSubdued",
    "--color-accentNonContentSubdued",
    lightAccentNonContentSubduedColor,
  );
  var lightAccentNonContentSoftColor = decreaseOpacityToContrast(
    lightAccentNonContentStrongColor,
    lightCardColor,
    softContrast,
  );
  setCssColor(
    "light",
    "accentNonContentSoft",
    "--color-accentNonContentSoft",
    lightAccentNonContentSoftColor,
  );

  // Establish light mode accent content colors
  var lightAccentContentStrongColor = adjustLuminanceToContrast(
    lightAccentContentBaselineColor,
    lightAccentContentBaselineColor,
    strongContrast,
    "decrease",
  );
  setCssColor(
    "light",
    "accentContentStrong",
    "--color-accentContentStrong",
    lightAccentContentStrongColor,
  );
  var lightAccentContentSubduedColor = decreaseOpacityToContrast(
    lightAccentContentStrongColor,
    lightCardColor,
    wcagContentContrast,
  );
  setCssColor(
    "light",
    "accentContentSubdued",
    "--color-accentContentSubdued",
    lightAccentContentSubduedColor,
  );

  // Establish light mode neutral content colors
  var lightDesaturatedNeutralContentStrongColor = setSaturation(
    lightAccentContentStrongColor,
    neutralSaturation,
  );
  var lightNeutralContentStrongColor = adjustLuminanceToContrast(
    lightDesaturatedNeutralContentStrongColor,
    blackColor,
    neutralContrast,
  );
  setCssColor(
    "light",
    "neutralContentStrong",
    "--color-neutralContentStrong",
    lightNeutralContentStrongColor,
  );
  var lightNeutralContentSubduedColor = decreaseOpacityToContrast(
    lightNeutralContentStrongColor,
    lightCardColor,
    wcagContentContrast,
  );
  setCssColor(
    "light",
    "neutralContentSubdued",
    "--color-neutralContentSubdued",
    lightNeutralContentSubduedColor,
  );

  // Establish light mode neutral non-content colors
  // Calculate the luminance difference between strong accent colors...
  // and apply the relative difference to the strong neutral content color...
  // to establish the strong neutral non-content color
  var lightAccentContentStrongColorLuminance = chroma(
    lightAccentContentStrongColor,
  ).luminance();
  var lightAccentNonContentStrongColorLuminance = chroma(
    lightAccentNonContentStrongColor,
  ).luminance();
  var lightNeutralContentStrongColorLuminance = chroma(
    lightNeutralContentStrongColor,
  ).luminance();
  var lightNeutralStrongAccentLuminance =
    (lightAccentNonContentStrongColorLuminance /
      lightAccentContentStrongColorLuminance) *
    lightNeutralContentStrongColorLuminance;
  var lightNeutralNonContentStrongColor = chroma(lightNeutralContentStrongColor)
    .luminance(lightNeutralStrongAccentLuminance)
    .hex();
  setCssColor(
    "light",
    "neutralNonContentStrong",
    "--color-neutralNonContentStrong",
    lightNeutralNonContentStrongColor,
  );
  var lightNeutralNonContentSubduedColor = decreaseOpacityToContrast(
    lightNeutralNonContentStrongColor,
    lightCardColor,
    wcagNonContentContrast,
  );
  setCssColor(
    "light",
    "neutralNonContentSubdued",
    "--color-neutralNonContentSubdued",
    lightNeutralNonContentSubduedColor,
  );
  var lightNeutralNonContentSoftColor = decreaseOpacityToContrast(
    lightNeutralNonContentStrongColor,
    lightCardColor,
    softContrast,
  );
  setCssColor(
    "light",
    "neutralNonContentSoft",
    "--color-neutralNonContentSoft",
    lightNeutralNonContentSoftColor,
  );

  // *********
  // DARK MODE
  // *********

  let createDarkMode = true;

  if (createDarkMode) {
    // Set UI style for dark mode
    // $("html").attr("data-theme", "dark");
    // $("body").css("background", "#000");
    // $(".swatch .value").css("background", "#000");
    // $("#canvas .card").css("box-shadow", "inset 0 0 0 1px var(--color-neutralNonContentSoft)");

    // Establish dark mode seed color...
    // by building on light mode colors
    var darkSeedColor = setSaturation(lightSeedColor, darkModeSaturation);
    setCssColor("dark", "seed", "--color-seed", darkSeedColor);

    // Establish dark mode background colors...
    // By building on lightNeutralContentStrongColor
    var darkCanvasColor = lightNeutralContentStrongColor;
    setCssColor("dark", "canvas", "--color-canvas", darkCanvasColor);
    var darkCardColor = adjustLuminanceToContrast(
      darkCanvasColor,
      darkCanvasColor,
      canvasContrast,
      "increase",
    );
    setCssColor("dark", "card", "--color-card", darkCardColor);

    // Establish dark mode accent baseline colors
    var darkAccentNonContentBaselineColor = adjustLuminanceToContrast(
      darkSeedColor,
      darkCardColor,
      wcagNonContentContrast,
    );
    setCssColor(
      "dark",
      "accentNonContentBaseline",
      "--color-accentNonContentBaseline",
      darkAccentNonContentBaselineColor,
    );
    var darkAccentContentBaselineColor = adjustLuminanceToContrast(
      darkSeedColor,
      darkCardColor,
      wcagContentContrast,
    );
    setCssColor(
      "dark",
      "accentContentBaseline",
      "--color-accentContentBaseline",
      darkAccentContentBaselineColor,
    );

    // // Establish dark mode accent non-content colors
    var darkAccentNonContentStrongColor = adjustLuminanceToContrast(
      darkAccentNonContentBaselineColor,
      darkAccentNonContentBaselineColor,
      strongContrast,
      "increase",
    );
    setCssColor(
      "dark",
      "accentNonContentStrong",
      "--color-accentNonContentStrong",
      darkAccentNonContentStrongColor,
    );
    var darkAccentNonContentSubduedColor = decreaseOpacityToContrast(
      darkAccentNonContentStrongColor,
      darkCardColor,
      wcagNonContentContrast,
    );
    // console.log(darkAccentNonContentSubduedColor);
    setCssColor(
      "dark",
      "accentNonContentSubdued",
      "--color-accentNonContentSubdued",
      darkAccentNonContentSubduedColor,
    );
    var darkAccentNonContentSoftColor = decreaseOpacityToContrast(
      darkAccentNonContentStrongColor,
      darkCardColor,
      softContrast,
    );
    setCssColor(
      "dark",
      "accentNonContentSoft",
      "--color-accentNonContentSoft",
      darkAccentNonContentSoftColor,
    );

    // Establish dark mode accent content colors
    var darkAccentContentStrongColor = adjustLuminanceToContrast(
      darkAccentContentBaselineColor,
      darkAccentContentBaselineColor,
      strongContrast,
      "increase",
    );
    setCssColor(
      "dark",
      "accentContentStrong",
      "--color-accentContentStrong",
      darkAccentContentStrongColor,
    );
    var darkAccentContentSubduedColor = decreaseOpacityToContrast(
      darkAccentContentStrongColor,
      darkCardColor,
      wcagContentContrast,
    );
    setCssColor(
      "dark",
      "accentContentSubdued",
      "--color-accentContentSubdued",
      darkAccentContentSubduedColor,
    );

    // Establish dark mode neutral content colors
    var darkDesaturatedNeutralContentStrongColor = setSaturation(
      darkAccentContentStrongColor,
      neutralSaturation,
    );
    var darkNeutralContentStrongColor = adjustLuminanceToContrast(
      darkDesaturatedNeutralContentStrongColor,
      whiteColor,
      neutralContrast,
    );
    setCssColor(
      "dark",
      "neutralContentStrong",
      "--color-neutralContentStrong",
      darkNeutralContentStrongColor,
    );
    var darkNeutralContentSubduedColor = decreaseOpacityToContrast(
      darkNeutralContentStrongColor,
      darkCardColor,
      wcagContentContrast,
    );
    setCssColor(
      "dark",
      "neutralContentSubdued",
      "--color-neutralContentSubdued",
      darkNeutralContentSubduedColor,
    );

    // Establish dark mode neutral non-content colors
    // Calculate the luminance difference between strong accent colors...
    // and apply the relative difference to the strong neutral content color...
    // to establish the strong neutral non-content color
    var darkAccentContentStrongColorLuminance = chroma(
      darkAccentContentStrongColor,
    ).luminance();
    var darkAccentNonContentStrongColorLuminance = chroma(
      darkAccentNonContentStrongColor,
    ).luminance();
    var darkNeutralContentStrongColorLuminance = chroma(
      darkNeutralContentStrongColor,
    ).luminance();
    var darkNeutralStrongAccentLuminance =
      (darkAccentNonContentStrongColorLuminance /
        darkAccentContentStrongColorLuminance) *
      darkNeutralContentStrongColorLuminance;
    var darkNeutralNonContentStrongColor = chroma(darkNeutralContentStrongColor)
      .luminance(darkNeutralStrongAccentLuminance)
      .hex();
    setCssColor(
      "dark",
      "neutralNonContentStrong",
      "--color-neutralNonContentStrong",
      darkNeutralNonContentStrongColor,
    );
    var darkNeutralNonContentSubduedColor = decreaseOpacityToContrast(
      darkNeutralNonContentStrongColor,
      darkCardColor,
      wcagNonContentContrast,
    );
    setCssColor(
      "dark",
      "neutralNonContentSubdued",
      "--color-neutralNonContentSubdued",
      darkNeutralNonContentSubduedColor,
    );
    var darkNeutralNonContentSoftColor = decreaseOpacityToContrast(
      darkNeutralNonContentStrongColor,
      darkCardColor,
      softContrast,
    );
    setCssColor(
      "dark",
      "neutralNonContentSoft",
      "--color-neutralNonContentSoft",
      darkNeutralNonContentSoftColor,
    );

    setSwatchValues($("html").attr("data-theme") as "light" | "dark");
  }
}
