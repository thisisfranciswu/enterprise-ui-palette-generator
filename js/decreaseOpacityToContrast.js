import chroma from 'chroma-js';

export function decreaseOpacityToContrast(fgColor, bgColor, targetContrast) {

  // console.log(fgColor, bgColor, targetContrast);

  const bgLuminance = chroma(bgColor).luminance(); // Get background luminance
  let fgLuminance = chroma(fgColor).luminance(); // Get foreground luminance
  let stepSize = 0.001; // Size and direction of luminance adjustment
  let precision = stepSize * 10; // targetContrast precision

  // function function to calculate blended luminance
	const blendColors = (fg, bg, opacity) => {
	  const fgRgb = chroma(fg).rgb();
	  const bgRgb = chroma(bg).rgb();
	  const blendedRgb = fgRgb.map((channel, i) => 
	    channel * opacity + bgRgb[i] * (1 - opacity)
	  );
	  return chroma(blendedRgb).luminance();
	};

  // Function to calculate contrast ratio
  const getContrast = (fgLuminance) => {
    const lighter = Math.max(fgLuminance, bgLuminance);
    const darker = Math.min(fgLuminance, bgLuminance);
    return (lighter + 0.05) / (darker + 0.05);
  };

  // Decrease opacity until fgContrast gets as close to targetContrast as possible
  var fgContrast = getContrast(fgLuminance); // Get fgColor's contrast
  var adjustedOpacity = 1; // Start with full opacity
  var iteration = 0;
  var maxIterations = 9999;
  while (Math.abs(fgContrast - targetContrast) > precision && iteration != maxIterations) {
    adjustedOpacity -= stepSize; // Reduce opacity by a step
    fgContrast = getContrast(blendColors(fgColor, bgColor, adjustedOpacity));
    iteration++;
    // console.log(adjustedOpacity, fgContrast, iteration);
  }

	// Return the color with the adjusted opacity in rgba format
	const [r, g, b] = chroma(fgColor).rgb();
  // console.log(`rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${adjustedOpacity.toFixed(3)})`);
	return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${adjustedOpacity.toFixed(3)})`;
}