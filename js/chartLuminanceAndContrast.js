import chroma from 'chroma-js';

export function chartLuminanceAndContrast(fgColor, bgColor) {

  const bgLuminance = chroma(bgColor).luminance(); // Get background luminance
  let fgLuminance = chroma(fgColor).luminance(); // Get foreground luminance
  let stepSize = 0.01; // Size luminance adjustment

  // Function to calculate contrast ratio
  const getContrast = (fgLuminance) => {
    const lighter = Math.max(fgLuminance, bgLuminance);
    const darker = Math.min(fgLuminance, bgLuminance);
    return (lighter + 0.05) / (darker + 0.05);
  };

  // Log current luminance and contrast
  var currentContrast = getContrast(fgLuminance);
  console.log(`Current: ${fgColor}, ${fgLuminance}, ${currentContrast.toFixed(3)}`);

  // Round fgLuminance to nearest 0.01.
  var adjustableLuminance = Number(fgLuminance.toFixed(2));

  // Increase adjustableLuminance until 1
  while (adjustableLuminance.toFixed(2) <= 1) {
    var fgContrast = getContrast(adjustableLuminance);
    console.log(`Increase: ${fgColor}, ${adjustableLuminance.toFixed(2)}, ${fgContrast.toFixed(3)}`);
    adjustableLuminance += stepSize;
  }

  // Reset adjustableLuminance
  var adjustableLuminance = Number(fgLuminance.toFixed(2));

  // Decrease adjustableLuminance until 0
  while (adjustableLuminance.toFixed(2) >= 0) {
    var fgContrast = getContrast(adjustableLuminance);
    console.log(`Decrease: ${fgColor}, ${adjustableLuminance.toFixed(2)}, ${fgContrast.toFixed(3)}`);
    adjustableLuminance -= stepSize;
  }

}