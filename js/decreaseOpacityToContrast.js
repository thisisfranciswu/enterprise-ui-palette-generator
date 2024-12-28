import chroma from 'chroma-js';

export function decreaseOpacityToContrast(fgColor, bgColor, targetContrast, precision = 0.0001) {

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