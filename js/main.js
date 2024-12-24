import chroma from 'chroma-js';

/**
 * Adjusts the luminance of a foreground color to achieve an exact WCAG contrast ratio against a background color.
 * @param {string} fgColor - The initial foreground color in any format supported by chroma.js.
 * @param {string} bgColor - The background color in any format supported by chroma.js.
 * @param {number} targetContrast - The desired WCAG contrast ratio.
 * @param {number} [tolerance=0.0001] - The precision of the contrast ratio match.
 * @returns {string} - The adjusted foreground color in hex format.
 */
function adjustLuminanceForContrast(fgColor, bgColor, targetContrast, tolerance = 0.0001) {
    const bgLuminance = chroma(bgColor).luminance(); // Get background luminance
    let lowerBound = 0; // Minimum luminance for foreground
    let upperBound = 1; // Maximum luminance for foreground

    // Get the current contrast ratio function
    const getContrast = (fgLuminance) => {
        const lighter = Math.max(fgLuminance, bgLuminance);
        const darker = Math.min(fgLuminance, bgLuminance);
        return (lighter + 0.05) / (darker + 0.05);
    };

    // Perform a binary search for the luminance value
    let adjustedLuminance = chroma(fgColor).luminance();
    while (upperBound - lowerBound > tolerance) {
        adjustedLuminance = (lowerBound + upperBound) / 2;
        const contrast = getContrast(adjustedLuminance);

        if (contrast < targetContrast) {
            upperBound = adjustedLuminance;
        } else {
            lowerBound = adjustedLuminance;
        }
    }

    // Return the new foreground color with the adjusted luminance
    return chroma(fgColor).luminance(adjustedLuminance).hex();
}

// Example usage:
console.log(adjustLuminanceForContrast("#000", "#FFF", 4.5));
console.log(adjustLuminanceForContrast("#404040", "#FFF", 4.5));
console.log(adjustLuminanceForContrast("#808080", "#FFF", 4.5));
console.log(adjustLuminanceForContrast("#C0C0C0", "#FFF", 4.5));
console.log(adjustLuminanceForContrast("#FFF", "#FFF", 4.5));
console.log(adjustLuminanceForContrast("#777777", "#FFF", 4.5));
console.log(adjustLuminanceForContrast("#123456", "#FFF", 4.5));
console.log(adjustLuminanceForContrast("#637990", "#FFF", 4.5));

