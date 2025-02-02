import chroma from "chroma-js";

/**
 * Adjusts a color's saturation to a specified percentage of its original value.
 *
 * @param {string} color - The input color in any valid CSS format (e.g., hex, rgb, etc.).
 * @param {number} saturation - The target saturation level as a percentage (e.g., 66 for 66%).
 * @returns {string} - The adjusted color in hexadecimal format.
 */
export function setSaturation(color: chroma.ChromaInput, saturation: number) {
  // Get the HSL components of the color
  const [h, s, l] = chroma(color).hsl();

  // Adjust the saturation by the specified percentage
  const adjustedSaturation = s * saturation;

  // Return the color with the adjusted saturation
  return chroma.hsl(h, adjustedSaturation, l).hex().toUpperCase();
}
