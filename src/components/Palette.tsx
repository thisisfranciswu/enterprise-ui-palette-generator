import { Swatch } from "./Swatch";

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
          <span
            className="accent-contrast sample"
            title="complimentary color"
          ></span>
          <span className="accent-triad-two sample" title="triad-1"></span>
          <span className="accent-triad-three sample" title="triad-2"></span>
          <span
            className="complimentary-triad-two sample"
            title="tetrad-1"
          ></span>
          <span
            className="complimentary-triad-three sample"
            title="tetrad-2"
          ></span>
        </figure>
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
