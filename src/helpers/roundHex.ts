/**
 *
 * @param {string} - hex string to be rounded
 * @returns {string} - rounded hex string
 */
export function improvedRoundHex(hexStr: string): string {
  const decimal = parseInt(hexStr, 16);
  const roundedDecimal = Math.round(decimal / 16) * 16;
  const roundedHexStr = roundedDecimal
    .toString(16)
    .toUpperCase()
    .padStart(2, "0");
  return roundedHexStr;
}
