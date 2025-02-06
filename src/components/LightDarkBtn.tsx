export const LightDarkBtn = () => {
  //   $("#lightModeBtn").on("click", function (e) {
  //     e.preventDefault();
  //     $("html").attr("data-theme", "light");
  //     $(this).attr("data-state", "on");
  //     $("#darkModeBtn").attr("data-state", "off");
  //     setSwatchValues("light");
  //     $("link[rel*='icon']").attr(
  //       "href",
  //       "/images/favicons/light/favicon-16x16.png",
  //     );
  //   });

  //   $("#darkModeBtn").on("click", function (e) {
  //     e.preventDefault();
  //     $("html").attr("data-theme", "dark");
  //     $(this).attr("data-state", "on");
  //     $("#lightModeBtn").attr("data-state", "off");
  //     setSwatchValues("dark");
  //     $("link[rel*='icon']").attr(
  //       "href",
  //       "/images/favicons/dark/favicon-16x16.png",
  //     );
  //   });

  return (
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
  );
};
