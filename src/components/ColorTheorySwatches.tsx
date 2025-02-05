import React from "react";

export const ColorTheorySwatches = () => {
  const handleClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const cssVar = `var(${target.dataset.cssVar}`;
    document.documentElement.style.setProperty("--header-color", cssVar);
  };

  return (
    <>
      <span
        className="accent-contrast sample"
        title="complimentary color"
        id="complimentary"
        data-css-var="--complimentary"
        onClick={handleClick}
      ></span>
      <span
        className="accent-triad-two sample"
        title="triad-1"
        data-css-var="--color-seed-triad-two"
        onClick={handleClick}
      ></span>
      <span
        className="accent-triad-three sample"
        title="triad-2"
        data-css-var="--color-seed-triad-three"
        onClick={handleClick}
      ></span>
      <span
        className="complimentary-triad-two sample"
        title="tetrad-1"
        data-css-var="--color-complimentary-triad-two"
        onClick={handleClick}
      ></span>
      <span
        className="complimentary-triad-three sample"
        title="tetrad-2"
        data-css-var="--color-complimentary-triad-three"
        onClick={handleClick}
      ></span>
    </>
  );
};
