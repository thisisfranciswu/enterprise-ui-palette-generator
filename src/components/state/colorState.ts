import { useAtom } from "jotai";
import { colorPaletteAtom } from "./stateManager";

export type HslObject = { h: number; s: number; l: number; alpha?: number };
export type Color = { light: HslObject; dark: HslObject };
export type Theme = "light" | "dark";

export interface ColorObject {
  name: string;
  light?: HslObject;
  dark?: HslObject;
}

export function getTheme() {
  const theme = document.documentElement.getAttribute("data-theme") as Theme;

  return theme;
}

export const useColorState = () => {
  const [colorPalette, setColorPalette] = useAtom(colorPaletteAtom);

  function getColorState(colorName: string): ColorObject | undefined;
  function getColorState(
    colorName: string,
    theme: Theme,
  ): HslObject | undefined;
  function getColorState(colorName: string, theme?: Theme) {
    const colorIndex = colorPalette.findIndex((x) => x.name === colorName);
    if (colorIndex === -1) return;

    if (theme) {
      if (!(colorPalette[colorIndex] && colorPalette[colorIndex][theme]))
        return;

      return colorPalette[colorIndex][theme];
    }
    return colorPalette[colorIndex];
  }

  function setColorState(clr: ColorObject) {
    const colorIndex = colorPalette.findIndex((x) => x.name === clr.name);

    if (colorIndex === -1) {
      const newPallete = [...colorPalette, clr];
      setColorPalette(newPallete);
      return;
    }

    setColorPalette([
      ...colorPalette.slice(0, colorIndex),
      { ...colorPalette[colorIndex], ...clr },
      ...colorPalette.slice(colorIndex + 1),
    ]);
  }

  return { getColorState, setColorState };
};
