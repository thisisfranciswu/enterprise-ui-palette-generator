import chroma from 'chroma-js';

import $ from 'jquery';
import { adjustLuminanceToContrast } from '../js/adjustLuminanceToContrast.js'
import { decreaseOpacityToContrast } from '../js/decreaseOpacityToContrast.js'
import { decreaseLuminanceToContrast } from '../js/decreaseLuminanceToContrast.js'
import { setSaturation } from '../js/setSaturation.js'

const wcagNonContentContrast = 3;
const wcagContentContrast = 4.5;
const root = document.documentElement;
const whiteColor = "#FFF";
const blackColor = "#000";

// Insert the random color value into the text field
$('#accentColor').val(chroma.random().hex());

generatePalette();

$('#generateBtn').on('click', function(e) {
  generatePalette();
  e.preventDefault();
});

function setCssColor(swatchId, cssVariable, color) {
  // Sets colors for both a swatch and a CSS variable
  root.style.setProperty(cssVariable, color);
  $(`#${swatchId} .value`).text(color);
}

function generatePalette() {

  const accentColor = document.getElementById('accentColor').value.trim();
  const canvasContrast = document.getElementById('canvasContrast').value.trim();
  const cardContrast = document.getElementById('cardContrast').value.trim();
  const softContrast = document.getElementById('softContrast').value.trim();
  const strongContrast = document.getElementById('strongContrast').value.trim();
  const neutralSaturation = document.getElementById('neutralSaturation').value.trim();
  const neutralContrast = document.getElementById('neutralContrast').value.trim();

  // Display seed color
  setCssColor('seed', '--color-seed', accentColor);

  // Establish background colors
  var canvasColor = adjustLuminanceToContrast(accentColor, whiteColor, canvasContrast);
  setCssColor('canvas', '--color-canvas', canvasColor);
  var cardColor = adjustLuminanceToContrast(accentColor, whiteColor, cardContrast);
  setCssColor('card', '--color-card', cardColor);

  // Establish accent baseline colors
  var accentNonContentBaselineColor = adjustLuminanceToContrast(accentColor, cardColor, wcagNonContentContrast);
  setCssColor('accentNonContentBaseline', '--color-accentNonContentBaseline', accentNonContentBaselineColor);
  var accentContentBaselineColor = adjustLuminanceToContrast(accentColor, cardColor, wcagContentContrast);
  setCssColor('accentContentBaseline', '--color-accentContentBaseline', accentContentBaselineColor);

  // Establish accent non-content colors
  var accentNonContentStrongColor = adjustLuminanceToContrast(accentNonContentBaselineColor, accentNonContentBaselineColor, strongContrast);
  setCssColor('accentNonContentStrong', '--color-accentNonContentStrong', accentNonContentStrongColor);
  var accentNonContentSubduedColor = decreaseOpacityToContrast(accentNonContentStrongColor, cardColor, wcagNonContentContrast);
  setCssColor('accentNonContentSubdued', '--color-accentNonContentSubdued', accentNonContentSubduedColor);
  var accentNonContentSoftColor = decreaseOpacityToContrast(accentNonContentStrongColor, cardColor, softContrast);
  setCssColor('accentNonContentSoft', '--color-accentNonContentSoft', accentNonContentSoftColor);

  // Establish accent content colors
  var accentContentStrongColor = adjustLuminanceToContrast(accentContentBaselineColor, accentContentBaselineColor, strongContrast);
  setCssColor('accentContentStrong', '--color-accentContentStrong', accentContentStrongColor);
  var accentContentSubduedColor = decreaseOpacityToContrast(accentContentStrongColor, cardColor, wcagContentContrast);
  setCssColor('accentContentSubdued', '--color-accentContentSubdued', accentContentSubduedColor);

  // Establish neutral content colors
  var desaturatedNeutralContentStrongColor = setSaturation(accentContentStrongColor, neutralSaturation);
  var neutralContentStrongColor = decreaseLuminanceToContrast(desaturatedNeutralContentStrongColor, blackColor, neutralContrast);
  setCssColor('neutralContentStrong', '--color-neutralContentStrong', neutralContentStrongColor);
  var neutralContentSubduedColor = decreaseOpacityToContrast(neutralContentStrongColor, cardColor, wcagContentContrast);
  setCssColor('neutralContentSubdued', '--color-neutralContentSubdued', neutralContentSubduedColor);

  // Establish neutral non-content colors
  var accentContentStrongColorLuminance = chroma(accentContentStrongColor).luminance();
  var accentNonContentStrongColorLuminance = chroma(accentNonContentStrongColor).luminance();
  var neutralContentStrongColorLuminance = chroma(neutralContentStrongColor).luminance();
  var neutralStrongAccentLuminance = accentNonContentStrongColorLuminance / accentContentStrongColorLuminance * chroma(neutralContentStrongColor).luminance();
  var neutralNonContentStrongColor = chroma(neutralContentStrongColor).luminance(neutralStrongAccentLuminance).hex();
  setCssColor('neutralNonContentStrong', '--color-neutralNonContentStrong', neutralNonContentStrongColor);
  var neutralNonContentSubduedColor = decreaseOpacityToContrast(neutralNonContentStrongColor, cardColor, wcagNonContentContrast);
  setCssColor('neutralNonContentSubdued', '--color-neutralNonContentSubdued', neutralNonContentSubduedColor);
  var neutralNonContentSoftColor = decreaseOpacityToContrast(neutralNonContentStrongColor, cardColor, softContrast);
  setCssColor('neutralNonContentSoft', '--color-neutralNonContentSoft', neutralNonContentSoftColor);

}