import chroma from "chroma-js";

export function generateRandomColor() {
  const randomColor = chroma.random().hex().toUpperCase();
  return randomColor;
}
