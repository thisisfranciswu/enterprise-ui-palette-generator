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
  const canvasContrast = 1.1;
  const cardContrast = 1.033;
  const faintContrast = 1.1;
  const strongContrast = 1.7;
  const neutralToAccentContrast = 1.3;
  const neutralSaturation = 0.333;

  // Display seed color
  setCssColor('--seed-color', accentColor);

  // Establish background colors
  var canvasColor = adjustLuminanceToContrast(accentColor, whiteColor, canvasContrast);
  setCssColor('--canvas-color', canvasColor);
  var cardColor = adjustLuminanceToContrast(accentColor, whiteColor, cardContrast);
  setCssColor('--card-color', cardColor);

  // Establish accent baseline colors
  var accentNonContentBaselineColor = adjustLuminanceToContrast(accentColor, cardColor, wcagNonContentContrast);
  setCssColor('--accentNonContentBaseline-color', accentNonContentBaselineColor);
  var accentContentBaselineColor = adjustLuminanceToContrast(accentColor, cardColor, wcagContentContrast);
  setCssColor('--accentContentBaseline-color', accentContentBaselineColor);

  // Establish accent non-content colors
  var accentNonContentStrongColor = adjustLuminanceToContrast(accentNonContentBaselineColor, accentNonContentBaselineColor, strongContrast);
  setCssColor('--accentNonContentStrong-color', accentNonContentStrongColor);
  var accentNonContentSubduedColor = decreaseOpacityToContrast(accentNonContentStrongColor, cardColor, wcagNonContentContrast);
  setCssColor('--accentNonContentSubdued-color', accentNonContentSubduedColor);
  var accentNonContentFaintColor = decreaseOpacityToContrast(accentNonContentStrongColor, cardColor, faintContrast);
  setCssColor('--accentNonContentFaint-color', accentNonContentFaintColor);

  // Establish accent content colors
  var accentContentStrongColor = adjustLuminanceToContrast(accentContentBaselineColor, accentContentBaselineColor, strongContrast);
  setCssColor('--accentContentStrong-color', accentContentStrongColor);
  var accentContentSubduedColor = decreaseOpacityToContrast(accentContentStrongColor, cardColor, wcagContentContrast);
  setCssColor('--accentContentSubdued-color', accentContentSubduedColor);

  // Establish neutral content colors
  var desaturatedNeutralContentStrongColor = setSaturation(accentContentStrongColor, neutralSaturation);
  var neutralContentStrongColor = decreaseLuminanceToContrast(desaturatedNeutralContentStrongColor, blackColor, neutralToAccentContrast);
  setCssColor('--neutralContentStrong-color', neutralContentStrongColor);
  var neutralContentSubduedColor = decreaseOpacityToContrast(neutralContentStrongColor, cardColor, wcagContentContrast);
  setCssColor('--neutralContentSubdued-color', neutralContentSubduedColor);

  // Establish neutral non-content colors
  var accentContentStrongColorLuminance = chroma(accentContentStrongColor).luminance();
  var accentNonContentStrongColorLuminance = chroma(accentNonContentStrongColor).luminance();
  var neutralContentStrongColorLuminance = chroma(neutralContentStrongColor).luminance();
  var neutralStrongAccentLuminance = accentNonContentStrongColorLuminance / accentContentStrongColorLuminance * chroma(neutralContentStrongColor).luminance();
  var neutralNonContentStrongColor = chroma(neutralContentStrongColor).luminance(neutralStrongAccentLuminance).hex();
  setCssColor('--neutralNonContentStrong-color', neutralNonContentStrongColor);
  var neutralNonContentSubduedColor = decreaseOpacityToContrast(neutralNonContentStrongColor, cardColor, wcagNonContentContrast);
  setCssColor('--neutralNonContentSubdued-color', neutralNonContentSubduedColor);
  var neutralNonContentFaintColor = decreaseOpacityToContrast(neutralNonContentStrongColor, cardColor, faintContrast);
  setCssColor('--neutralNonContentFaint-color', neutralNonContentFaintColor);

}