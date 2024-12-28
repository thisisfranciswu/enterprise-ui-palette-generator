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

function setColor(color, $swatch, cssVariable) {
  // Sets colors for both a swatch and a CSS variable
  $swatch.css("background-color", color);
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
  var $seed = $("#seed span");
  $seed.css("background-color", accentColor);

  // Establish background colors
  var $canvas = $("#canvas span");
  var canvasColor = adjustLuminanceToContrast(accentColor, whiteColor, canvasContrast);
  setColor(canvasColor, $canvas, '--canvas-color');
  var $card = $("#card span");
  var cardColor = adjustLuminanceToContrast(accentColor, whiteColor, cardContrast);
  setColor(cardColor, $card, '--card-color');

  // Establish accent baseline colors
  var $accentNonContentBaseline = $("#accentNonContentBaseline span");
  var accentNonContentBaselineColor = adjustLuminanceToContrast(accentColor, cardColor, wcagNonContentContrast);
  $accentNonContentBaseline.css("background-color", accentNonContentBaselineColor);
  var $accentContentBaseline = $("#accentContentBaseline span");
  var accentContentBaselineColor = adjustLuminanceToContrast(accentColor, cardColor, wcagContentContrast);
  $accentContentBaseline.css("background-color", accentContentBaselineColor);

  // Establish accent non-content colors
  var $accentNonContentStrong = $("#accentNonContentStrong span");
  var accentNonContentStrongColor = adjustLuminanceToContrast(accentNonContentBaselineColor, accentNonContentBaselineColor, strongContrast);
  $accentNonContentStrong.css("background-color", accentNonContentStrongColor);
  var $accentNonContentSubdued = $("#accentNonContentSubdued span");
  var accentNonContentSubduedColor = decreaseOpacityToContrast(accentNonContentStrongColor, cardColor, wcagNonContentContrast);
  $accentNonContentSubdued.css("background-color", accentNonContentSubduedColor);
  var $accentNonContentFaint = $("#accentNonContentFaint span");
  var accentNonContentFaintColor = decreaseOpacityToContrast(accentNonContentStrongColor, cardColor, faintContrast);
  $accentNonContentFaint.css("background-color", accentNonContentFaintColor);

  // Establish accent content colors
  var $accentContentStrong = $("#accentContentStrong span");
  var accentContentStrongColor = adjustLuminanceToContrast(accentContentBaselineColor, accentContentBaselineColor, strongContrast);
  $accentContentStrong.css("background-color", accentContentStrongColor);
  var $accentContentSubdued = $("#accentContentSubdued span");
  var accentContentSubduedColor = decreaseOpacityToContrast(accentContentStrongColor, cardColor, wcagContentContrast);
  $accentContentSubdued.css("background-color", accentContentSubduedColor);

  // Establish neutral content colors
  var $neutraltContentStrong = $("#neutralContentStrong span");
  var desaturatedNeutralContentStrongColor = setSaturation(accentContentStrongColor, neutralSaturation);
  var neutralContentStrongColor = decreaseLuminanceToContrast(desaturatedNeutralContentStrongColor, blackColor, neutralToAccentContrast);
  $neutraltContentStrong.css("background-color", neutralContentStrongColor);
  var $neutralContentSubdued = $("#neutralContentSubdued span");
  var neutralContentSubduedColor = decreaseOpacityToContrast(neutralContentStrongColor, cardColor, wcagContentContrast);
  $neutralContentSubdued.css("background-color", neutralContentSubduedColor);

  // Establish neutral non-content colors
  var $neutraltNonContentStrong = $("#neutralNonContentStrong span");
  var accentContentStrongColorLuminance = chroma(accentContentStrongColor).luminance();
  var accentNonContentStrongColorLuminance = chroma(accentNonContentStrongColor).luminance();
  var neutralContentStrongColorLuminance = chroma(neutralContentStrongColor).luminance();
  var neutralStrongAccentLuminance = accentNonContentStrongColorLuminance / accentContentStrongColorLuminance * chroma(neutralContentStrongColor).luminance();
  var neutralNonContentStrongColor = chroma(neutralContentStrongColor).luminance(neutralStrongAccentLuminance).hex();
  $neutraltNonContentStrong.css("background-color", neutralNonContentStrongColor);
  var $neutralNonContentSubdued = $("#neutralNonContentSubdued span");
  var neutralNonContentSubduedColor = decreaseOpacityToContrast(neutralNonContentStrongColor, cardColor, wcagNonContentContrast);
  $neutralNonContentSubdued.css("background-color", neutralNonContentSubduedColor);
  var $neutralNonContentFaint = $("#neutralNonContentFaint span");
  var neutralNonContentFaintColor = decreaseOpacityToContrast(neutralNonContentStrongColor, cardColor, faintContrast);
  $neutralNonContentFaint.css("background-color", neutralNonContentFaintColor);




  // var neutralNonContentStrongColor = decreaseLuminanceToContrast(accentNonContentStrongColor, blackColor, neutralToAccentContrast);
  // $neutraltNonContentStrong.css("background-color", neutralNonContentStrongColor);



}