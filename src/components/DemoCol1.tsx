export const DemoCol1 = () => {
  return (
    <div className="col">
      <div className="card">
        <form>
          <div className="form-group">
            <label>Name</label>
            <div className="form-row">
              <input type="text" />
              <button className="btn">Submit</button>
            </div>
          </div>
        </form>

        <ul className="menu">
          <li className="selected">
            <a href="#">John</a>
          </li>
          <li>
            <a href="#">Paul</a>
          </li>
          <li>
            <a href="#">George</a>
          </li>
          <li>
            <a href="#">Ringo</a>
          </li>
          <li>
            <a href="#">Billy</a>
          </li>
        </ul>

        <div className="alert">
          <span className="material-symbols-rounded">info</span>
          Please upgrade to the new version.
        </div>

        <div>
          <span className="tag">Fully-featured</span>
          <span className="tag tag-outlined">Open source</span>
        </div>

        <div>
          <button className="btn">Submit</button>
          <button className="btn btn-outlined">Cancel</button>
          <button className="btn btn-soft">Skip</button>
        </div>

        <div>
          <input type="checkbox" />
          <input type="checkbox" defaultChecked />
          <input type="radio" />
          <input type="radio" defaultChecked />
          <input type="checkbox" role="switch" />
          <input type="checkbox" role="switch" defaultChecked />
        </div>
      </div>

      <div className="card">
        <div className="media">
          <img src="images/clem_fandango.webp" />
          <div className="text-pair text-pair-md-sm">
            <div className="text-md">Clem Fandango</div>
            <div className="text-sm">clem.fandango@example.com</div>
          </div>
        </div>
      </div>
    </div>
  );
};
