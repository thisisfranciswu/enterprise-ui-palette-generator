import { atom } from "jotai";
import { ColorObject, Theme } from "./colorState";

export const colorPaletteAtom = atom<ColorObject[]>([]);

export const themeAtom = atom<Theme>("light");
