import chroma from 'chroma-js';
import $ from 'jquery';

const wcagNonContentContrast = 3;
const wcagContentContrast = 4.5;

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

$('#generateBtn').on('click', function(e) {

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
  $canvas.css("background-color", canvasColor);
  var $card = $("#card span");
  var cardColor = adjustColorForContrast(accentColor, "#FFF", cardContrast);
  $card.css("background-color", cardColor);

  // Establish baseline colors
  var $nonContentBaseline = $("#nonContentBaseline span");
  var nonContentBaselineColor = adjustColorForContrast(accentColor, cardColor, wcagNonContentContrast);
  $nonContentBaseline.css("background-color", nonContentBaselineColor);
  var $contentBaseline = $("#contentBaseline span");
  var contentBaselineColor = adjustColorForContrast(accentColor, cardColor, wcagContentContrast);
  $contentBaseline.css("background-color", contentBaselineColor);

  // Establish non-content colors
  var $nonContentDefault = $("#nonContentDefault span");
  var nonContentDefaultColor = adjustColorForContrast(nonContentBaselineColor, nonContentBaselineColor, defaultContrast);
  $nonContentDefault.css("background-color", nonContentDefaultColor);
  var $nonContentSubdued = $("#nonContentSubdued span");
  var nonContentSubduedColor = adjustColorForContrast(nonContentDefaultColor, cardColor, wcagNonContentContrast, true);
  console.log(nonContentSubduedColor);
  $nonContentSubdued.css("background-color", nonContentSubduedColor);
  var $nonContentFaint = $("#nonContentFaint span");
  var nonContentFaintColor = adjustColorForContrast(nonContentDefaultColor, cardColor, faintContrast, true);
  $nonContentFaint.css("background-color", nonContentFaintColor);

  // Establish content colors
  var $contentDefault = $("#contentDefault span");
  var contentDefaultColor = adjustColorForContrast(contentBaselineColor, contentBaselineColor, defaultContrast);
  $contentDefault.css("background-color", contentDefaultColor);
  var $contentSubduedColor = $("#contentSubdued span");
  var contentSubduedColor = adjustColorForContrast(contentDefaultColor, cardColor, wcagContentContrast, true);
  $contentSubduedColor.css("background-color", contentSubduedColor);

  e.preventDefault();

});