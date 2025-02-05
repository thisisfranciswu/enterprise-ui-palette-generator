import "normalize.css";
import "./App.scss";
import { Palette } from "./components/Palette";
import { Settings } from "./components/settings";
import { DemoCol2 } from "./components/DemoCol2";
import { DemoCol3 } from "./components/DemoCol3";
import { DemoCol1 } from "./components/DemoCol1";
import { init } from "./js/main";
import { useEffect, useState } from "react";
import { Header } from "./components/Header";

function App() {
  const [inited, setInited] = useState(false);

  useEffect(() => {
    if (inited) return;
    init();
    setInited(true);
  }, []);

  return (
    <>
      <Header />
      <div className="container">
        <img
          src="images/social_media_thumbnail.jpg"
          alt="Social media thumbnail"
          className="hidden-social-media-thumbnail"
        />

        <section id="intro">
          <p>
            <strong>Background:</strong> This is a tool to automate the
            generation of accessible enterprise UI color palettes. It draws
            inspiration from
            <a href="https://www.radix-ui.com/colors/custom" target="_blank">
              Radix UI's custom color palette tool
            </a>
            , but its color generation rules are mostly based on those I laid
            out in a
            <a
              href="https://uxdesign.cc/a-systematic-approach-to-generating-enterprise-ui-color-palettes-ecaf0c164c17"
              target="_blank"
            >
              Medium article I wrote
            </a>
            . Check it out on
            <a
              href="https://github.com/thisisfranciswu/enterprise-ui-palette-generator"
              target="_blank"
            >
              GitHub
            </a>{" "}
            and{" "}
            <a href="https://thisisfranciswu.com/enterprise-ui-palette-generator/">
              original
            </a>
            .
          </p>
          <p>
            <strong>Usage:</strong> Refresh the page to generate a palette based
            on a random accent color. Play with the inputs and click on the
            "Generate" button to generate a palette based on the accent color.
            This is a proof of concept and there's no form validation. Toggle
            light and dark mode to how the modes impact the color palettes.
          </p>
        </section>

        <div id="aside-and-main">
          <Settings />

          <main>
            <Palette />
            <section id="demo">
              <h2>Demo</h2>
              <div id="canvas">
                <DemoCol1 /> <DemoCol2 /> <DemoCol3 />
              </div>
            </section>
          </main>
        </div>
      </div>
    </>
  );
}

export default App;
