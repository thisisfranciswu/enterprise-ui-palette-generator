import chroma from 'chroma-js';

export function decreaseLuminanceToContrast(fgColor, bgColor, targetContrast, precision = 0.0001) {
  const bgLuminance = chroma(bgColor).luminance(); // Background luminance
  let fgLuminance = chroma(fgColor).luminance(); // Initial foreground luminance

  // Function to calculate contrast ratio
  const getContrast = (fgLum) => (fgLum + 0.05) / (bgLuminance + 0.05);

  // Ensure foreground luminance starts higher than background luminance
  if (fgLuminance <= bgLuminance) {
    throw new Error("Foreground luminance must start higher than background luminance.");
  }

  // Check if the current contrast already meets or exceeds the target
  if (getContrast(fgLuminance) <= targetContrast) {
    return fgColor; // No adjustment needed
  }

  // Binary search to find the correct luminance
  let lowerBound = 0; // Lowest possible luminance
  let upperBound = fgLuminance; // Initial luminance of the foreground color
  let adjustedLuminance = fgLuminance; // To hold the final adjusted luminance

  while (upperBound - lowerBound > precision) {
    const midPoint = (lowerBound + upperBound) / 2;
    const contrast = getContrast(midPoint);

    if (contrast > targetContrast) {
      upperBound = midPoint; // Decrease luminance
    } else {
      lowerBound = midPoint; // Increase luminance slightly
    }
  }

  // Use the final lower bound for the adjusted luminance
  adjustedLuminance = lowerBound;

  // Apply adjusted luminance back to the foreground color
  const adjustedColor = chroma(fgColor).luminance(adjustedLuminance).hex().toUpperCase();

  return adjustedColor;
}
