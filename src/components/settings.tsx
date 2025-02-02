export const Settings = () => {
  return (
    <aside id="settings">
      <form>
        <h2>Settings</h2>

        <div className="form-group">
          <label htmlFor="accentColor">Accent</label>
          <div className="decorated-input">
            <span className="mini-swatch"></span>
            <input type="text" id="accentColor" />
            <button id="randomColorBtn" className="btn btn-icon btn-trailing">
              <span className="material-symbols-rounded">shuffle</span>
            </button>
          </div>
          <span id="tryBrandColor" className="input-hint">
            Try a brand color from
            <a href="#" data-color-value="#1DB954">
              Spotify
            </a>
            ,
            <a href="#" data-color-value="#F96302">
              Home Depot
            </a>
            , or
            <a href="#" data-color-value="#FF0000">
              YouTube
            </a>
            .
          </span>
        </div>

        <div className="form-group">
          <label htmlFor="canvasContrast">Canvas contrast</label>
          <input type="text" id="canvasContrast" defaultValue="1.1" />
        </div>

        <div className="form-group">
          <label htmlFor="cardContrast">Card contrast</label>
          <input type="text" id="cardContrast" defaultValue="1.033" />
        </div>

        <div className="form-group">
          <label htmlFor="softContrast">Soft contrast</label>
          <input type="text" id="softContrast" defaultValue="1.1" />
        </div>

        <div className="form-group">
          <label htmlFor="strongContrast">Strong contrast</label>
          <input type="text" id="strongContrast" defaultValue="1.7" />
        </div>

        <div className="form-group">
          <label htmlFor="neutralSaturation">Neutral saturation</label>
          <input type="text" id="neutralSaturation" defaultValue="0.333" />
        </div>

        <div className="form-group">
          <label htmlFor="neutralContrast">Neutral contrast</label>
          <input type="text" id="neutralContrast" defaultValue="1.3" />
        </div>

        <div className="form-group">
          <label htmlFor="darkModeSaturation">Dark mode saturation</label>
          <input type="text" id="darkModeSaturation" defaultValue="0.666" />
        </div>

        <button id="generateBtn" className="btn">
          Generate
        </button>

        <button
          id="exportBtn"
          className="btn btn-outlined btn-block"
          title="Exports CSS variables to clipboard"
        >
          Export
        </button>
      </form>
    </aside>
  );
};
