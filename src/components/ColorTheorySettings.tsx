import { useEffect, useRef, useState } from "react";
import style from "./ColorTheorySettings.module.css";
import { extractStringInsideParentheses } from "../helpers/extractFromParentesis";
import { getTheme, HslObject, useColorState } from "./state/colorState";
import { useAtomValue } from "jotai";
import { themeAtom } from "./state/stateManager";

export const ColorTheorySettings = () => {
  const [show, setShow] = useState(false);
  const lightnessInput = useRef<HTMLInputElement>(null);
  const saturationInput = useRef<HTMLInputElement>(null);

  const { getColorState, setColorState } = useColorState();
  const theme = useAtomValue(themeAtom);

  const calculateColors = () => {
    let hsl = getColorState("logoColor", theme);
    console.log("hsl from state", hsl);

    if (!hsl) {
      const hslForWeb = document
        .getElementById("seed")!
        .getAttribute(`data-${theme}-color`);
      if (!hslForWeb) throw new Error("No hslForWeb");
      let hslString = extractStringInsideParentheses(hslForWeb!)[0];
      const sep = hslString.includes(",") ? "," : " ";
      console.log("hslString", hslString);
      const hslArr = hslString.split(sep).map((x) => parseInt(x));
      hsl = {
        h: (hslArr[0] + 180) % 360,
        s:
          theme === "light"
            ? 100 - hslArr[1]
            : Math.min(100 - hslArr[1] - (100 - hslArr[1]) / 2, 20),
        l: theme === "light" ? 80 : Math.max(hslArr[2] - hslArr[2] / 3, 60),
      };
      setColorState({ name: "logoColor", [theme]: hsl });
    }
    if (isNaN(hsl.h) || isNaN(hsl.s) || isNaN(hsl.l)) return;
    // const complWeb = hslTweak(hsl, {}, 1);
    // console.log("complWeb", complWeb, hsl);
    updateColorSwatches(hsl);

    const root = document.documentElement;
    root.style.setProperty("--header-color", "var(--complimentary)");
    if (!hsl) return;
    lightnessInput.current!.value = nr(hsl.l, 1).toString();
    saturationInput.current!.value = nr(hsl.s, 1).toString();
  };

  useEffect(() => {
    window.addEventListener("paletteGenerated", calculateColors);
  }, [theme, calculateColors]);

  useEffect(() => {
    setTimeout(calculateColors, 2000);
  }, []);

  /**
   * @param hsl - HSL object with s, l values between 0-100
   */
  const updateColorSwatches = (hsl: HslObject) => {
    const root = document.documentElement;
    root.style.setProperty("--complimentary", hslTweak(hsl, {}, 1));
    root.style.setProperty(
      "--color-seed-triad-two",
      hslTweak(hsl, { h: 60 }, 1),
    );
    root.style.setProperty(
      "--color-seed-triad-three",
      hslTweak(hsl, { h: -60 }, 1),
    );
    root.style.setProperty(
      "--color-complimentary-triad-two",
      hslTweak(hsl, { h: 180 + 60 }, 1),
    );
    root.style.setProperty(
      "--color-complimentary-triad-three",
      hslTweak(hsl, { h: 180 - 60 }, 1),
    );
  };

  const handleChange = () => {
    const theme = getTheme();
    const complimentaryHsl = getColorState("logoColor", theme);
    if (!complimentaryHsl) throw new Error("No complimentaryHsl");
    const hsl = {
      h: complimentaryHsl.h,
      s: nr(saturationInput.current!.value, 1),
      l: nr(lightnessInput.current!.value, 1),
    };
    updateColorSwatches(hsl);
    setColorState({ name: "logoColor", [theme]: hsl });
    const newHsl = hslTweak(hsl, {}, 1);
    document.documentElement.style.setProperty("--complimentary", newHsl);
  };

  return (
    <div className={style["color-theory-settings"]}>
      <div className={style.panel} hidden={!show}>
        <p>Subset settings:</p>

        <div>
          <input
            className="slider"
            type="range"
            id="saturation"
            name="saturation"
            min="0"
            max="100"
            ref={saturationInput}
            onChange={handleChange}
          />
          <label htmlFor="saturation">Saturation</label>
        </div>

        <div>
          <input
            className="slider"
            type="range"
            id="lumina"
            name="lumina"
            min="0"
            max="100"
            ref={lightnessInput}
            onChange={handleChange}
          />
          <label htmlFor="lumina">Lumina</label>
        </div>
      </div>
      <button className="btn btn-outlined btn-block">
        <span
          className={style["material-symbols-rounded"]}
          onClick={() => {
            console.log(getColorState("logoColor"));
            setShow(!show);
          }}
        >
          Tune
        </span>
      </button>
    </div>
  );
};

export function nr(str: string | number, base = 100) {
  if (typeof str === "string") str = +str.replace(/[^0-9\.]/g, "");
  return Math.round(str * base);
}

export function rgbToHex(r: number, g: number, b: number) {
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
}

/**
 *
 * @param r - red value (0-255)
 * @param g - green value (0-255)
 * @param b - blue value (0-255)
 * @returns - HSL object, h (0-360), s (0-1), l (0-1)
 */
export function rgbToHsl({ r, g, b, alpha }: RgbObject) {
  (r /= 255), (g /= 255), (b /= 255);
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0,
    s = 0,
    l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d) * 60 + (g < b ? 360 : 0);
        break;
      case g:
        h = ((b - r) / d) * 60 + 120;
        break;
      case b:
        h = ((r - g) / d) * 60 + 240;
        break;
    }
  }

  return alpha ? { h, s, l, alpha } : { h, s, l };
}

type RgbObject = { r: number; g: number; b: number; alpha?: number };

export const hexToRgb = (hex: string): RgbObject => {
  if (hex.length === 4) {
    hex = hex
      .split("")
      .map((char) => char + char)
      .join("")
      .slice(1);
  }
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  };
};

export const hslTweak = (
  hsl: HslObject,
  { h = 0, s = 0, l = 0 }: Partial<HslObject> = {},
  base = 100,
) =>
  `hsl(${nr(hsl.h, 1) + h}, ${nr(hsl.s, base) + s}%, ${nr(hsl.l, base) + l}%)`;

export function getBackgroundColorHsl(element: HTMLElement) {
  const style = getComputedStyle(element);
  const backgroundColor = style.backgroundColor.split(" ");
  if (!backgroundColor) return { h: 0, s: 0, l: 0 };

  // Extract the RGB values from the backgroundColor string
  const rgbValues = [
    nr(backgroundColor[1], 255) ?? 0,
    nr(backgroundColor[2], 255) ?? 0,
    nr(backgroundColor[3], 255) ?? 0,
  ];
  console.log(backgroundColor, " - rgb: ", rgbValues);

  // Convert RGB to hex
  return (
    rgbToHsl({ r: rgbValues[0], g: rgbValues[1], b: rgbValues[2] }) ?? {
      h: 0,
      s: 0,
      l: 0,
    }
  );
}
