import chroma from 'chroma-js';

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

    // Adjust luminance approach
    let lowerBound = 0 + precision; // Minimum luminance for foreground
    let upperBound = 1 - precision; // Maximum luminance for foreground

    // Get the current contrast ratio function
    const getContrast = (fgLuminance) => {
      const lighter = Math.max(fgLuminance, bgLuminance);
      const darker = Math.min(fgLuminance, bgLuminance);
      return (lighter + 0.05) / (darker + 0.05);
    };

    // Perform a binary search for the luminance value
    let adjustedLuminance = chroma(fgColor).luminance();
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
document.getElementById('accentColor').value = chroma.random().hex();

document.getElementById('generateBtn').addEventListener('click', (e) => {

  const accentColor = document.getElementById('accentColor').value.trim();
  const canvasContrast = 1.1;
  const cardContrast = 1.033;
  const faintContrast = 1.1;
  const defaultContrast = 1.7;

  // Establish baseline colors
  const nonContentBaseline = document.getElementById('nonContentBaseline');
  const nonContentBaselineColor = adjustColorForContrast(accentColor, "#FFF", wcagNonContentContrast);
  nonContentBaseline.style.backgroundColor = nonContentBaselineColor;
  console.log(nonContentBaselineColor);
  const contentBaseline = document.getElementById('contentBaseline');
  const contentBaselineColor = adjustColorForContrast(accentColor, "#FFF", wcagContentContrast);
  contentBaseline.style.backgroundColor = contentBaselineColor;
  console.log(contentBaselineColor);

  // Establish background colors
  const canvas = document.getElementById('canvas');
  const canvasColor = adjustColorForContrast(nonContentBaselineColor, "#FFF", canvasContrast);
  canvas.style.backgroundColor = canvasColor;
  console.log(canvasColor);
  const card = document.getElementById('card');
  const cardColor = adjustColorForContrast(nonContentBaselineColor, "#FFF", cardContrast);
  card.style.backgroundColor = cardColor;
  console.log(cardColor);

  // Establish non-content colors
  const nonContentFaint = document.getElementById('nonContentFaint');
  const nonContentFaintColor = adjustColorForContrast(nonContentBaselineColor, cardColor, canvasContrast);
  nonContentFaint.style.backgroundColor = nonContentFaintColor;
  console.log(nonContentFaintColor);
  const nonContentDefault = document.getElementById('nonContentDefault');
  const nonContentDefaultColor = adjustColorForContrast(nonContentBaselineColor, nonContentBaselineColor, defaultContrast);
  nonContentDefault.style.backgroundColor = nonContentDefaultColor;
  console.log(nonContentDefaultColor);
  const nonContentSubdued = document.getElementById('nonContentSubdued');
  const nonContentSubduedColor = adjustColorForContrast(nonContentDefaultColor, cardColor, wcagNonContentContrast, true);
  nonContentSubdued.style.backgroundColor = nonContentSubduedColor;
  console.log(nonContentSubduedColor);

  // Establish content colors
  const contentDefault = document.getElementById('contentDefault');
  const contentDefaultColor = adjustColorForContrast(contentBaselineColor, contentBaselineColor, defaultContrast);
  contentDefault.style.backgroundColor = contentDefaultColor;
  console.log(contentDefaultColor);
  const contentSubdued = document.getElementById('contentSubdued');
  const contentSubduedColor = adjustColorForContrast(contentDefaultColor, cardColor, wcagContentContrast, true);
  contentSubdued.style.backgroundColor = contentSubduedColor;
  console.log(contentSubduedColor);

  // Example usage
  console.log("Example usage");
  console.log(adjustColorForContrast('#6fa14e', '#fff', 3)); // Expected: #71a250
  console.log(adjustColorForContrast('#6fa14e', '#fff', 4.5)); // Expected: #59823f
  console.log(adjustColorForContrast('#71a250', '#fff', 1.1)); // Expected: #f1f6ed
  console.log(adjustColorForContrast('#71a250', '#fff', 1.033)); // Expected: #fafcf9
  console.log(adjustColorForContrast('#71a250', '#fafcf9', 1.1)); // Expected: #ecf3e8
  console.log(adjustColorForContrast('#71a250', '#71a250', 1.7)); // Expected: #54783b
  console.log(adjustColorForContrast('#59823f', '#59823f', 1.7)); // Previously incorrect, now handled


  e.preventDefault();

});
