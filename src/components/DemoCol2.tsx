export const DemoCol2 = () => {
  return (
    <div className="col">
      <div className="card">
        <div className="toolbar">
          <div className="btn-group">
            <button className="btn">
              <span className="material-symbols-rounded">format_bold</span>
            </button>
            <button className="btn">
              <span className="material-symbols-rounded">format_italic</span>
            </button>
            <button className="btn">
              <span className="material-symbols-rounded">
                format_underlined
              </span>
            </button>
          </div>
          <div className="btn-group">
            <button className="btn">
              <span className="material-symbols-rounded">
                format_list_numbered
              </span>
            </button>
            <button className="btn">
              <span className="material-symbols-rounded">
                format_list_bulleted
              </span>
            </button>
            <button className="btn">
              <span className="material-symbols-rounded">
                format_align_left
              </span>
            </button>
          </div>
          <div className="btn-group">
            <button className="btn">
              <span className="material-symbols-rounded">link</span>
            </button>
            <button className="btn">
              <span className="material-symbols-rounded">image</span>
            </button>
            <button className="btn">
              <span className="material-symbols-rounded">theaters</span>
            </button>
          </div>
        </div>

        <button className="btn btn-select">Old Fashioned</button>
      </div>

      <form className="card">
        <div className="form-group">
          <label>Name</label>
          <input type="text" />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" />
        </div>
        <button className="btn btn-block">Create account</button>
        <p className="or">
          <span>Or</span>
        </p>
        <button className="btn btn-outlined btn-block">
          Continue with GitHub
        </button>
      </form>

      <div className="toast">Task failed successfully.</div>
    </div>
  );
};
