import { useAtom } from "jotai";
import { setSwatchValues } from "../js/main";
import { themeAtom } from "./state/stateManager";

export const LightDarkBtn = () => {
  const [theme, setTheme] = useAtom(themeAtom);

  const handleClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const theme = target.id === "lightModeBtn" ? "light" : "dark";
    setTheme(theme);
    document.documentElement.setAttribute("data-theme", theme);
    const otherTheme = theme === "light" ? "dark" : "light";
    target.setAttribute("data-state", "on");
    document
      .getElementById(`${otherTheme}ModeBtn`)!
      .setAttribute("data-state", "off");
    // Update swatche values
    setSwatchValues(theme);
    // Update favicon
    document
      .querySelector("link[rel*='icon']")!
      .setAttribute("href", `/images/favicons/${theme}/favicon-16x16.png`);
    window.dispatchEvent(new CustomEvent("paletteGenerated"));
  };

  return (
    <div className="heading">
      <h2>Palette ({theme})</h2>
      <div id="toggleMode">
        <button
          id="lightModeBtn"
          className="btn"
          data-state="on"
          onClick={handleClick}
        >
          <span className="material-symbols-rounded">light_mode</span>
          Light
        </button>
        <button
          id="darkModeBtn"
          className="btn"
          data-state="off"
          onClick={handleClick}
        >
          <span className="material-symbols-rounded">dark_mode</span>
          Dark
        </button>
      </div>
    </div>
  );
};
