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

function setCssColor(cssVariable, color) {
  // Sets colors for both a swatch and a CSS variable
  root.style.setProperty(cssVariable, color);
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
  setCssColor('--color-seed', accentColor);

  // Establish background colors
  var canvasColor = adjustLuminanceToContrast(accentColor, whiteColor, canvasContrast);
  setCssColor('--color-canvas', canvasColor);
  var cardColor = adjustLuminanceToContrast(accentColor, whiteColor, cardContrast);
  setCssColor('--color-card', cardColor);

  // Establish accent baseline colors
  var accentNonContentBaselineColor = adjustLuminanceToContrast(accentColor, cardColor, wcagNonContentContrast);
  setCssColor('--color-accentNonContentBaseline', accentNonContentBaselineColor);
  var accentContentBaselineColor = adjustLuminanceToContrast(accentColor, cardColor, wcagContentContrast);
  setCssColor('--color-accentContentBaseline', accentContentBaselineColor);

  // Establish accent non-content colors
  var accentNonContentStrongColor = adjustLuminanceToContrast(accentNonContentBaselineColor, accentNonContentBaselineColor, strongContrast);
  setCssColor('--color-accentNonContentStrong', accentNonContentStrongColor);
  var accentNonContentSubduedColor = decreaseOpacityToContrast(accentNonContentStrongColor, cardColor, wcagNonContentContrast);
  setCssColor('--color-accentNonContentSubdued', accentNonContentSubduedColor);
  var accentNonContentSoftColor = decreaseOpacityToContrast(accentNonContentStrongColor, cardColor, softContrast);
  setCssColor('--color-accentNonContentSoft', accentNonContentSoftColor);

  // Establish accent content colors
  var accentContentStrongColor = adjustLuminanceToContrast(accentContentBaselineColor, accentContentBaselineColor, strongContrast);
  setCssColor('--color-accentContentStrong', accentContentStrongColor);
  var accentContentSubduedColor = decreaseOpacityToContrast(accentContentStrongColor, cardColor, wcagContentContrast);
  setCssColor('--color-accentContentSubdued', accentContentSubduedColor);

  // Establish neutral content colors
  var desaturatedNeutralContentStrongColor = setSaturation(accentContentStrongColor, neutralSaturation);
  var neutralContentStrongColor = decreaseLuminanceToContrast(desaturatedNeutralContentStrongColor, blackColor, neutralContrast);
  setCssColor('--color-neutralContentStrong', neutralContentStrongColor);
  var neutralContentSubduedColor = decreaseOpacityToContrast(neutralContentStrongColor, cardColor, wcagContentContrast);
  setCssColor('--color-neutralContentSubdued', neutralContentSubduedColor);

  // Establish neutral non-content colors
  var accentContentStrongColorLuminance = chroma(accentContentStrongColor).luminance();
  var accentNonContentStrongColorLuminance = chroma(accentNonContentStrongColor).luminance();
  var neutralContentStrongColorLuminance = chroma(neutralContentStrongColor).luminance();
  var neutralStrongAccentLuminance = accentNonContentStrongColorLuminance / accentContentStrongColorLuminance * chroma(neutralContentStrongColor).luminance();
  var neutralNonContentStrongColor = chroma(neutralContentStrongColor).luminance(neutralStrongAccentLuminance).hex();
  setCssColor('--color-neutralNonContentStrong', neutralNonContentStrongColor);
  var neutralNonContentSubduedColor = decreaseOpacityToContrast(neutralNonContentStrongColor, cardColor, wcagNonContentContrast);
  setCssColor('--color-neutralNonContentSubdued', neutralNonContentSubduedColor);
  var neutralNonContentSoftColor = decreaseOpacityToContrast(neutralNonContentStrongColor, cardColor, softContrast);
  setCssColor('--color-neutralNonContentSoft', neutralNonContentSoftColor);

}