import chroma from 'chroma-js';
import $ from 'jquery';

const wcagNonContentContrast = 3;
const wcagContentContrast = 4.5;
const root = document.documentElement;

/**
 * Adjusts the luminance of a foreground color to achieve an exact WCAG contrast ratio against a background color.
 * @param {string} fgColor - The initial foreground color in any format supported by chroma.js.
 * @param {string} bgColor - The background color in any format supported by chroma.js.
 * @param {number} targetContrast - The desired WCAG contrast ratio.
 * @param {number} [precision=0.0001] - The precision of the contrast ratio match.
 * @returns {string} - The adjusted foreground color in hex format.
 */
function adjustColorForContrast(fgColor, bgColor, targetContrast, reduceOpacity = false, precision = 0.0001) {
  const bgLuminance = chroma(bgColor).luminance(); // Get background luminance

  if (!reduceOpacity) {

    let fgLuminance = chroma(fgColor).luminance(); // Get foreground luminance

    // Function to calculate contrast ratio
    const getContrast = (fgLuminance) => {
      const lighter = Math.max(fgLuminance, bgLuminance);
      const darker = Math.min(fgLuminance, bgLuminance);
      return (lighter + 0.05) / (darker + 0.05);
    };

    // If foreground and background colors are identical
    if (chroma(fgColor).hex() === chroma(bgColor).hex()) {
      if (targetContrast <= 1) {
        return fgColor; // No adjustment needed since contrast ratio of 1 is already achieved
      } else {
        // Adjust luminance to achieve the desired contrast ratio
        while (getContrast(fgLuminance) < targetContrast) {
          fgLuminance -= precision;
          if (fgLuminance < 0) {
            fgLuminance = 0;
            break;
          }
        }
        return chroma(fgColor).luminance(fgLuminance).hex();
      }
    }

    // Adjust luminance approach using binary search
    let lowerBound = 0; // Minimum luminance for foreground
    let upperBound = 1; // Maximum luminance for foreground
    let adjustedLuminance = fgLuminance;

    while (upperBound - lowerBound > precision) {
      adjustedLuminance = (lowerBound + upperBound) / 2;
      const contrast = getContrast(adjustedLuminance);

      if (contrast < targetContrast) {
        upperBound = adjustedLuminance;
      } else {
        lowerBound = adjustedLuminance;
      }
    }

    // Return the color with the adjusted luminance
    return chroma(fgColor).luminance(adjustedLuminance).hex();

  } else {
    const bgLuminance = chroma(bgColor).luminance(); // Get background luminance

    // Blend function to calculate blended luminance
    const blendColors = (fg, bg, opacity) => {
      const fgRgb = chroma(fg).rgb();
      const bgRgb = chroma(bg).rgb();
      const blendedRgb = fgRgb.map((channel, i) => 
        channel * opacity + bgRgb[i] * (1 - opacity)
      );
      return chroma(blendedRgb).luminance();
    };

    // Get the current contrast ratio function
    const getContrast = (blendedLuminance) => {
      const lighter = Math.max(blendedLuminance, bgLuminance);
      const darker = Math.min(blendedLuminance, bgLuminance);
      return (lighter + 0.05) / (darker + 0.05);
    };

    // Adjust opacity to find the desired contrast
    let lowerBound = 0; // Minimum opacity
    let upperBound = 1; // Maximum opacity
    let adjustedOpacity = 1;

    while (upperBound - lowerBound > precision) {
      adjustedOpacity = (lowerBound + upperBound) / 2;
      const blendedLuminance = blendColors(fgColor, bgColor, adjustedOpacity);
      const contrast = getContrast(blendedLuminance);

      if (contrast < targetContrast) {
        lowerBound = adjustedOpacity;
      } else {
        upperBound = adjustedOpacity;
      }
    }

    // Return the color with the adjusted opacity in rgba format
    const [r, g, b] = chroma(fgColor).rgb();
    return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${adjustedOpacity.toFixed(4)})`;
  }
}

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
  const defaultContrast = 1.7;

  // Display seed color
  var $seed = $("#seed span");
  $seed.css("background-color", accentColor);

  // Establish background colors
  var $canvas = $("#canvas span");
  var canvasColor = adjustColorForContrast(accentColor, "#FFF", canvasContrast);
  setColor(canvasColor, $canvas, '--canvas-color');
  var $card = $("#card span");
  var cardColor = adjustColorForContrast(accentColor, "#FFF", cardContrast);
  setColor(cardColor, $card, '--card-color');

  // Establish accent baseline colors
  var $accentNonContentBaseline = $("#accentNonContentBaseline span");
  var accentNonContentBaselineColor = adjustColorForContrast(accentColor, cardColor, wcagNonContentContrast);
  $accentNonContentBaseline.css("background-color", accentNonContentBaselineColor);
  var $accentContentBaseline = $("#accentContentBaseline span");
  var accentContentBaselineColor = adjustColorForContrast(accentColor, cardColor, wcagContentContrast);
  $accentContentBaseline.css("background-color", accentContentBaselineColor);

  // Establish accent non-content colors
  var $accentNonContentStrong = $("#accentNonContentStrong span");
  var accentNonContentStrongColor = adjustColorForContrast(accentNonContentBaselineColor, accentNonContentBaselineColor, defaultContrast);
  $accentNonContentStrong.css("background-color", accentNonContentStrongColor);
  var $accentNonContentSubdued = $("#accentNonContentSubdued span");
  var accentNonContentSubduedColor = adjustColorForContrast(accentNonContentStrongColor, cardColor, wcagNonContentContrast, true);
  $accentNonContentSubdued.css("background-color", accentNonContentSubduedColor);
  var $accentNonContentFaint = $("#accentNonContentFaint span");
  var accentNonContentFaintColor = adjustColorForContrast(accentNonContentStrongColor, cardColor, faintContrast, true);
  $accentNonContentFaint.css("background-color", accentNonContentFaintColor);

  // Establish accent content colors
  var $accentContentStrong = $("#accentContentStrong span");
  var accentContentStrongColor = adjustColorForContrast(accentContentBaselineColor, accentContentBaselineColor, defaultContrast);
  $accentContentStrong.css("background-color", accentContentStrongColor);
  var $accentContentSubdued = $("#accentContentSubdued span");
  var accentContentSubduedColor = adjustColorForContrast(accentContentStrongColor, cardColor, wcagContentContrast, true);
  $accentContentSubdued.css("background-color", accentContentSubduedColor);

}