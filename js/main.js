import chroma from 'chroma-js';

function adjustColorToContrast(fgColor, bgColor, targetContrast, reduceOpacity = false) {
  let fg = chroma(fgColor);
  const bg = chroma(bgColor);
  let contrast = chroma.contrast(fg, bg);
  let iterations = 0;
  const MAX_ITERATIONS = 999;
  const STEP = 0.01; // Increased step size

  while (Math.abs(contrast - targetContrast) > 0.1 && iterations < MAX_ITERATIONS) {
    const luminance = fg.luminance();
    if (contrast > targetContrast) {
      fg = fg.luminance(luminance + STEP); // Increase luminance to decrease contrast
    } else {
      fg = fg.luminance(luminance - STEP); // Decrease luminance to increase contrast
    }
    contrast = chroma.contrast(fg, bg);
    iterations++;
  }
  
  return reduceOpacity ? fg.rgba().toString() : fg.hex();
}

// Basic usage with hex colors
const color1 = adjustColorToContrast("#000", "#ffffff", 4.5);
console.log(color1); // Returns hex color

const color2 = adjustColorToContrast("#808080", "#ffffff", 4.5);
console.log(color2); // Returns hex color

const color3 = adjustColorToContrast("#FFF", "#ffffff", 4.5);
console.log(color3); // Returns hex color
