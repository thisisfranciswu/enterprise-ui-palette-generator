import chroma from 'chroma-js';

export function adjustLuminanceToContrast(fgColor, bgColor, targetContrast, fgLuminanceDirection) {

  const bgLuminance = chroma(bgColor).luminance(); // Get background luminance
  let fgLuminance = chroma(fgColor).luminance(); // Get foreground luminance
  let stepSize = 0.0001; // Size and direction of luminance adjustment
  let precision = stepSize * 500; // targetContrast precision

  // console.log(fgColor, bgColor, targetContrast);

  // Function to calculate contrast ratio
  const getContrast = (fgLuminance) => {
    const lighter = Math.max(fgLuminance, bgLuminance);
    const darker = Math.min(fgLuminance, bgLuminance);
    return (lighter + 0.05) / (darker + 0.05);
  };

  // Determine appropriate luminance direction
  var fgLighterLuminance = chroma(fgColor).luminance(fgLuminance * 1.25).luminance(); // Get luminance of lightened fgColor...
  var fgLighterContrast = getContrast(fgLighterLuminance); // ... and get its contrast ratio
  var fgDarkerLuminance = chroma(fgColor).luminance(fgLuminance * 0.75).luminance(); // Get luminance of darkened fgColor...
  var fgDarkerContrast = getContrast(fgDarkerLuminance); // ... and get its contrast ratio
  // console.log(`fgLighterContrast: ${fgLighterContrast} | fgDarkerContrast: ${fgDarkerContrast}`);

  // Determine direction by comparing contrast ratios
  var diffLighter = Math.abs(fgLighterContrast - targetContrast);
  var diffDarker = Math.abs(fgDarkerContrast - targetContrast);
  // console.log(`diffLighter: ${diffLighter} | diffDarker: ${diffDarker}`);

  if (fgLuminanceDirection === undefined) {
    // Determine fgLuminanceDirection if underfined
    if (diffDarker < diffLighter) { // If darkening luminance gets us closer to targetContrast...
      var fgLuminanceDirection = "decrease";
      // console.log("should decrease luminance");
    } else {
      // console.log("should increase luminance");
    }
  }
  if (fgLuminanceDirection === "decrease") {
    stepSize = -stepSize; // Decrease luminance via negative steps
  }

  // Adjust fgLuminance until fgContrast gets as close to targetContrast as possible
  var fgContrast = getContrast(fgLuminance); // Get fgColor's contrast
  var adjustedLuminance = fgLuminance; // Start with fgColor's luminance
  var adjustedFgColor;
  var iteration = 0;
  var maxIterations = 999999;
  while (Math.abs(fgContrast - targetContrast) > precision && iteration != maxIterations) {
    // console.log(`fgContrast: ${fgContrast} contrastDiff: ${Math.abs(fgContrast - targetContrast)}`);
    adjustedLuminance += stepSize;
    // console.log(`adjustedLuminance: ${adjustedLuminance}`);
    fgContrast = getContrast(adjustedLuminance);
    iteration++;
    // console.log(fgContrast, iteration);
  }

  // Return the color with the adjusted luminance
  // console.log(chroma(fgColor).luminance(adjustedLuminance).hex().toUpperCase());
  return chroma(fgColor).luminance(adjustedLuminance).hex().toUpperCase();

}