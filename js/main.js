import chroma from 'chroma-js';

import $ from 'jquery';
import { adjustLuminanceToContrast } from '../js/adjustLuminanceToContrast.js'
import { decreaseOpacityToContrast } from '../js/decreaseOpacityToContrast.js'
import { setSaturation } from '../js/setSaturation.js'

const wcagNonContentContrast = 3;
const wcagContentContrast = 4.5;
const root = document.documentElement;
const whiteColor = "#FFF";
const blackColor = "#000";

// Insert the random color value into the text field
$('#accentColor').val(chroma.random().hex().toUpperCase());

generatePalette();

$('#generateBtn').on('click', function(e) {
  generatePalette();
  e.preventDefault();
});

function setCssColor(swatchId, cssVariable, color) {
  root.style.setProperty(cssVariable, color);
  $(`#${swatchId} .value`).text(color);
}

function generatePalette() {

  const accentColor = $('#accentColor').val().trim();
  const canvasContrast = $('#canvasContrast').val().trim();
  const cardContrast = $('#cardContrast').val().trim();
  const softContrast = $('#softContrast').val().trim();
  const strongContrast = $('#strongContrast').val().trim();
  const neutralSaturation = $('#neutralSaturation').val().trim();
  const neutralContrast = $('#neutralContrast').val().trim();
  const darkModeSaturation = $('#darkModeSaturation').val().trim();

  // **********
  // LIGHT MODE
  // **********

  // Establish light mode seed color
  var lightSeedColor = accentColor;
  setCssColor('seed', '--color-seed', lightSeedColor.toUpperCase());

  // Establish light mode background colors
  var lightCanvasColor = adjustLuminanceToContrast(lightSeedColor, whiteColor, canvasContrast);
  setCssColor('canvas', '--color-canvas', lightCanvasColor);
  var lightCardColor = adjustLuminanceToContrast(lightSeedColor, whiteColor, cardContrast);
  setCssColor('card', '--color-card', lightCardColor);

  // Establish light mode accent baseline colors
  var lightAccentNonContentBaselineColor = adjustLuminanceToContrast(lightSeedColor, lightCardColor, wcagNonContentContrast);
  setCssColor('accentNonContentBaseline', '--color-accentNonContentBaseline', lightAccentNonContentBaselineColor);
  var lightAccentContentBaselineColor = adjustLuminanceToContrast(lightSeedColor, lightCardColor, wcagContentContrast);
  setCssColor('accentContentBaseline', '--color-accentContentBaseline', lightAccentContentBaselineColor);

  // Establish light mode accent non-content colors
  var lightAccentNonContentStrongColor = adjustLuminanceToContrast(lightAccentNonContentBaselineColor, lightAccentNonContentBaselineColor, strongContrast, "decrease");
  setCssColor('accentNonContentStrong', '--color-accentNonContentStrong', lightAccentNonContentStrongColor);
  var lightAccentNonContentSubduedColor = decreaseOpacityToContrast(lightAccentNonContentStrongColor, lightCardColor, wcagNonContentContrast);
  setCssColor('accentNonContentSubdued', '--color-accentNonContentSubdued', lightAccentNonContentSubduedColor);
  var lightAccentNonContentSoftColor = decreaseOpacityToContrast(lightAccentNonContentStrongColor, lightCardColor, softContrast);
  setCssColor('accentNonContentSoft', '--color-accentNonContentSoft', lightAccentNonContentSoftColor);

  // Establish light mode accent content colors
  var lightAccentContentStrongColor = adjustLuminanceToContrast(lightAccentContentBaselineColor, lightAccentContentBaselineColor, strongContrast, "decrease");
  setCssColor('accentContentStrong', '--color-accentContentStrong', lightAccentContentStrongColor);
  var lightAccentContentSubduedColor = decreaseOpacityToContrast(lightAccentContentStrongColor, lightCardColor, wcagContentContrast);
  setCssColor('accentContentSubdued', '--color-accentContentSubdued', lightAccentContentSubduedColor);

  // Establish light mode neutral content colors
  var lightDesaturatedNeutralContentStrongColor = setSaturation(lightAccentContentStrongColor, neutralSaturation);
  var lightNeutralContentStrongColor = adjustLuminanceToContrast(lightDesaturatedNeutralContentStrongColor, blackColor, neutralContrast);
  setCssColor('neutralContentStrong', '--color-neutralContentStrong', lightNeutralContentStrongColor);
  var lightNeutralContentSubduedColor = decreaseOpacityToContrast(lightNeutralContentStrongColor, lightCardColor, wcagContentContrast);
  setCssColor('neutralContentSubdued', '--color-neutralContentSubdued', lightNeutralContentSubduedColor);

  // Establish light mode neutral non-content colors
  // Calculate the luminance difference between strong accent colors...
  // and apply the relative difference to the strong neutral content color...
  // to establish the strong neutral non-content color
  var lightAccentContentStrongColorLuminance = chroma(lightAccentContentStrongColor).luminance();
  var lightAccentNonContentStrongColorLuminance = chroma(lightAccentNonContentStrongColor).luminance();
  var lightNeutralContentStrongColorLuminance = chroma(lightNeutralContentStrongColor).luminance();
  var lightNeutralStrongAccentLuminance = lightAccentNonContentStrongColorLuminance / lightAccentContentStrongColorLuminance * lightNeutralContentStrongColorLuminance;
  var lightNeutralNonContentStrongColor = chroma(lightNeutralContentStrongColor).luminance(lightNeutralStrongAccentLuminance).hex();
  setCssColor('neutralNonContentStrong', '--color-neutralNonContentStrong', lightNeutralNonContentStrongColor);
  var lightNeutralNonContentSubduedColor = decreaseOpacityToContrast(lightNeutralNonContentStrongColor, lightCardColor, wcagNonContentContrast);
  setCssColor('neutralNonContentSubdued', '--color-neutralNonContentSubdued', lightNeutralNonContentSubduedColor);
  var lightNeutralNonContentSoftColor = decreaseOpacityToContrast(lightNeutralNonContentStrongColor, lightCardColor, softContrast);
  setCssColor('neutralNonContentSoft', '--color-neutralNonContentSoft', lightNeutralNonContentSoftColor);

  // *********
  // DARK MODE
  // *********

  let createDarkMode = false;

  if (createDarkMode) {

    // Set UI style for dark mode
    $("body").css("background", "#000");
    $(".swatch .value").css("background", "#000");
    $("#canvas .card").css("box-shadow", "inset 0 0 0 1px var(--color-neutralNonContentSoft)");

    // Establish dark mode seed color...
    // by building on light mode colors
    var darkSeedColor = setSaturation(lightSeedColor, darkModeSaturation);
    setCssColor('seed', '--color-seed', darkSeedColor);

    // Establish dark mode background colors...
    // By building on lightNeutralContentStrongColor
    var darkCanvasColor = lightNeutralContentStrongColor;
    setCssColor('canvas', '--color-canvas', darkCanvasColor);
    var darkCardColor = adjustLuminanceToContrast(darkCanvasColor, darkCanvasColor, canvasContrast);
    setCssColor('card', '--color-card', darkCardColor);

    // Establish dark mode accent baseline colors
    var darkAccentNonContentBaselineColor = adjustLuminanceToContrast(darkSeedColor, darkCardColor, wcagNonContentContrast);
    setCssColor('accentNonContentBaseline', '--color-accentNonContentBaseline', darkAccentNonContentBaselineColor);
    var darkAccentContentBaselineColor = adjustLuminanceToContrast(darkSeedColor, darkCardColor, wcagContentContrast);
    setCssColor('accentContentBaseline', '--color-accentContentBaseline', darkAccentContentBaselineColor);

    // // Establish dark mode accent non-content colors
    var darkAccentNonContentStrongColor = adjustLuminanceToContrast(darkAccentNonContentBaselineColor, darkAccentNonContentBaselineColor, strongContrast, "increase");
    setCssColor('accentNonContentStrong', '--color-accentNonContentStrong', darkAccentNonContentStrongColor);
    var darkAccentNonContentSubduedColor = decreaseOpacityToContrast(darkAccentNonContentStrongColor, darkCardColor, wcagNonContentContrast);
    // console.log(darkAccentNonContentSubduedColor);
    setCssColor('accentNonContentSubdued', '--color-accentNonContentSubdued', darkAccentNonContentSubduedColor);
    var darkAccentNonContentSoftColor = decreaseOpacityToContrast(darkAccentNonContentStrongColor, darkCardColor, softContrast);
    setCssColor('accentNonContentSoft', '--color-accentNonContentSoft', darkAccentNonContentSoftColor);

    // Establish dark mode accent content colors
    var darkAccentContentStrongColor = adjustLuminanceToContrast(darkAccentContentBaselineColor, darkAccentContentBaselineColor, strongContrast, "increase");
    setCssColor('accentContentStrong', '--color-accentContentStrong', darkAccentContentStrongColor);
    var darkAccentContentSubduedColor = decreaseOpacityToContrast(darkAccentContentStrongColor, darkCardColor, wcagContentContrast);
    setCssColor('accentContentSubdued', '--color-accentContentSubdued', darkAccentContentSubduedColor);

    // Establish dark mode neutral content colors
    var darkDesaturatedNeutralContentStrongColor = setSaturation(darkAccentContentStrongColor, neutralSaturation);
    var darkNeutralContentStrongColor = adjustLuminanceToContrast(darkDesaturatedNeutralContentStrongColor, whiteColor, neutralContrast);
    setCssColor('neutralContentStrong', '--color-neutralContentStrong', darkNeutralContentStrongColor);
    var darkNeutralContentSubduedColor = decreaseOpacityToContrast(darkNeutralContentStrongColor, darkCardColor, wcagContentContrast);
    setCssColor('neutralContentSubdued', '--color-neutralContentSubdued', darkNeutralContentSubduedColor);

    // Establish dark mode neutral non-content colors
    // Calculate the luminance difference between strong accent colors...
    // and apply the relative difference to the strong neutral content color...
    // to establish the strong neutral non-content color
    var darkAccentContentStrongColorLuminance = chroma(darkAccentContentStrongColor).luminance();
    var darkAccentNonContentStrongColorLuminance = chroma(darkAccentNonContentStrongColor).luminance();
    var darkNeutralContentStrongColorLuminance = chroma(darkNeutralContentStrongColor).luminance();
    var darkNeutralStrongAccentLuminance = darkAccentNonContentStrongColorLuminance / darkAccentContentStrongColorLuminance * darkNeutralContentStrongColorLuminance;
    var darkNeutralNonContentStrongColor = chroma(darkNeutralContentStrongColor).luminance(darkNeutralStrongAccentLuminance).hex();
    setCssColor('neutralNonContentStrong', '--color-neutralNonContentStrong', darkNeutralNonContentStrongColor);
    var darkNeutralNonContentSubduedColor = decreaseOpacityToContrast(darkNeutralNonContentStrongColor, darkCardColor, wcagNonContentContrast);
    setCssColor('neutralNonContentSubdued', '--color-neutralNonContentSubdued', darkNeutralNonContentSubduedColor);
    var darkNeutralNonContentSoftColor = decreaseOpacityToContrast(darkNeutralNonContentStrongColor, darkCardColor, softContrast);
    setCssColor('neutralNonContentSoft', '--color-neutralNonContentSoft', darkNeutralNonContentSoftColor);

  }

}