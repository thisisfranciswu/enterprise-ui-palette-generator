import { Swatch } from "./Swatch";
import { ColorTheorySettings } from "./ColorTheorySettings";
import { ColorTheorySwatches } from "./ColorTheorySwatches";

export const Palette = () => {
  return (
    <section id="palette">
      <div className="heading">
        <h2>Palette</h2>
        <div id="toggleMode">
          <button id="lightModeBtn" className="btn" data-state="on">
            <span className="material-symbols-rounded">light_mode</span>
            Light
          </button>
          <button id="darkModeBtn" className="btn" data-state="off">
            <span className="material-symbols-rounded">dark_mode</span>
            Dark
          </button>
        </div>
      </div>

      <div id="accent">
        <figure className="color-swatch">
          <figcaption>Seed</figcaption>
          <Swatch id="seed" />
          <ColorTheorySwatches />
        </figure>
        <details id="colorTheory">
          <summary>Color theory subset</summary>
          <div id="donutCharts">
            <ui-chart size={100}>
              <ui-chart-ledgend
                label="complemetary"
                value={10}
                color="var(--complimentary)"
              ></ui-chart-ledgend>
              <ui-chart-ledgend
                label="triad[1]"
                value={10}
                color="var(--color-seed-triad-two)"
              ></ui-chart-ledgend>
              <ui-chart-ledgend
                label="triad[2]"
                value={10}
                color="var(--color-seed-triad-three)"
              ></ui-chart-ledgend>
            </ui-chart>
            <ColorTheorySettings />
            <ui-chart size={100}>
              <ui-chart-ledgend
                label="seed triad[1]"
                value={10}
                color="var(--color-complimentary-triad-two)"
              ></ui-chart-ledgend>
              <ui-chart-ledgend
                label="seed triad[2]"
                value={10}
                color="var(--color-complimentary-triad-three)"
              ></ui-chart-ledgend>
            </ui-chart>
          </div>
        </details>
      </div>

      <div id="backgrounds" className="row ui-swatches">
        <figure className="color-swatch">
          <figcaption>Canvas</figcaption>
          <Swatch id="canvas" />
        </figure>
        <figure className="color-swatch">
          <figcaption>Card</figcaption>
          <Swatch id="card" />
        </figure>
      </div>

      <div className="row">
        <div id="nonContentGroup" className="col">
          <figure className="color-swatch">
            <figcaption>Accent Non-Content Baseline</figcaption>
            <Swatch id="accentNonContentBaseline" />
          </figure>

          <div className="row ui-swatches">
            <figure className="color-swatch">
              <figcaption>Accent Non-Content Soft</figcaption>
              <Swatch id="accentNonContentSoft" />
            </figure>
            <figure className="color-swatch">
              <figcaption>Accent Non-Content Subdued</figcaption>
              <Swatch id="accentNonContentSubdued" />
            </figure>
            <figure className="color-swatch">
              <figcaption>Accent Non-Content Strong</figcaption>
              <Swatch id="accentNonContentStrong" />
            </figure>
          </div>

          <div className="row ui-swatches">
            <figure className="color-swatch">
              <figcaption>Neutral Non-Content Soft</figcaption>
              <Swatch id="neutralNonContentSoft" />
            </figure>
            <figure className="color-swatch">
              <figcaption>Neutral Non-Content Subdued</figcaption>
              <Swatch id="neutralNonContentSubdued" />
            </figure>
            <figure className="color-swatch">
              <figcaption>Neutral Non-Content Strong</figcaption>
              <Swatch id="neutralNonContentStrong" />
            </figure>
          </div>
        </div>

        <div id="contentGroup" className="col">
          <figure className="color-swatch">
            <figcaption>Accent Content Baseline</figcaption>
            <Swatch id="accentContentBaseline" />
          </figure>

          <div className="row ui-swatches">
            <figure className="color-swatch">
              <figcaption>Accent Content Subdued</figcaption>
              <Swatch id="accentContentSubdued" />
            </figure>
            <figure className="color-swatch">
              <figcaption>Accent Content Strong</figcaption>
              <Swatch id="accentContentStrong" />
            </figure>
          </div>

          <div className="row ui-swatches">
            <figure className="color-swatch">
              <figcaption>Neutral Content Subdued</figcaption>
              <Swatch id="neutralContentSubdued" />
            </figure>
            <figure className="color-swatch">
              <figcaption>Neutral Content Strong</figcaption>
              <Swatch id="neutralContentStrong" />
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
};
