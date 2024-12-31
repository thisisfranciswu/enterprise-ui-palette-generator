import chroma from 'chroma-js';

export function adjustLuminanceToContrast(fgColor, bgColor, targetContrast, precision = 0.0001) {

  const bgLuminance = chroma(bgColor).luminance(); // Get background luminance
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
      return chroma(fgColor).luminance(fgLuminance).hex().toUpperCase();
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
  return chroma(fgColor).luminance(adjustedLuminance).hex().toUpperCase();

}