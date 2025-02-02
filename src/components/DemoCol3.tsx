export const DemoCol3 = () => {
  return (
    <div className="col">
      <ul className="nav nav-tabs">
        <li className="selected">
          <a href="#">Jello</a>
        </li>
        <li>
          <a href="#">East Bay</a>
        </li>
        <li>
          <a href="#">Klaus</a>
        </li>
        <li>
          <a href="#">D.H.</a>
        </li>
      </ul>

      <div className="card">
        <div className="avatars">
          <span className="avatar">
            <img src="images/clem_fandango.webp" />
          </span>
          <span className="avatar avatar-one-letter avatar-solid avatar-subdued">
            V
          </span>
          <span className="avatar avatar-two-letter avatar-solid avatar-subdued">
            BG
          </span>
          <span className="avatar avatar-icon avatar-solid avatar-subdued">
            <span className="material-symbols-rounded">group</span>
          </span>
          <span className="avatar avatar-icon avatar-solid avatar-strong">
            <span className="material-symbols-rounded">group</span>
          </span>
        </div>

        <div className="avatars">
          <span className="avatar">
            <img src="images/clem_fandango.webp" />
          </span>
          <span className="avatar avatar-one-letter avatar-soft avatar-subdued">
            V
          </span>
          <span className="avatar avatar-two-letter avatar-soft avatar-subdued">
            BG
          </span>
          <span className="avatar avatar-icon avatar-soft avatar-subdued">
            <span className="material-symbols-rounded">group</span>
          </span>
          <span className="avatar avatar-icon avatar-soft avatar-strong">
            <span className="material-symbols-rounded">group</span>
          </span>
        </div>

        <hr />

        <blockquote>
          Reginald Poppycock is an eccentric <a href="#">inventor</a> and
          professional cheese sculptor, who designed the
          <a href="#">world’s first steam-powered teapot</a> capable of reciting
          <a href="#">Shakespearean sonnets</a> while brewing Earl Grey, from
          1884 to 1885.
        </blockquote>

        <div className="checkboxes">
          <div className="form-check">
            <input type="checkbox" />
            <label>
              Respond to comment <a href="#">#129</a> from Jake
            </label>
          </div>
          <div className="form-check">
            <input type="checkbox" />
            <label>
              Invite <a href="#">John McClane</a> to Nakatomi Plaza
            </label>
          </div>
          <div className="form-check">
            <input type="checkbox" />
            <label>
              Create TPS report <a href="#">requested</a> by Bill Lumbergh
            </label>
          </div>
          <div className="form-check form-check-struckout">
            <input type="checkbox" defaultChecked />
            <label>Lay off 62 employees</label>
          </div>
          <div className="form-check form-check-struckout">
            <input type="checkbox" defaultChecked />
            <label>Review Robert Johnson's contract</label>
          </div>
        </div>
      </div>
    </div>
  );
};
