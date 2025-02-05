import { html, css } from "lit";
import { BaseClass } from "./baseClass.js";

export class UiChart extends BaseClass {
  root;

  static properties = {
    type: { type: String },
    colors: { type: String },
    size: { type: Number },
    radix: { type: Number },
    baseColor: { type: String, attribute: "base-color" },
    noLedgend: { type: Boolean, attribute: "no-ledgend" },
  };

  static styles = css`
      :host {
        display: block;
        contain: layout;
        box-sizing: border-box;
        width: calc(var(--size) * 1px);
        height: calc(var(--size) * 1px);
        position: relative;
        margin-block: 4rem;
      }
          
      :host([no-ledgend]) slot {
        display: none;
        margin-block: 0;
      }
  
      .donut {
        --size: 300;
        --clip-path: "M 0 0 H 300 V 300 H 0 Z M 150 150 m -50, 0 a 50,50 0 1,0 100,0 a 50,50 0 1,0 -100,0 Z";
        --conic-gradient: conic-gradient(#ff5722 0% 35%, #ffeb3b 35% 60%, #2196f3 60% 100%);
        width: calc(var(--size) * 1px);
        height: calc(var(--size) * 1px);
        background: var(--conic-gradient);
        display: inline-block;
        border-radius: 50%;
        clip-path: path(var(--clip-path));
        );
      }
    `;

  constructor() {
    super();
    this.type = "donut";
    this.colors = ["#ff5722", "#ffeb3b", "#2196f3"];
    this.size = 300;
    //this.radix = Math.abs(this.size / 4);
    this.baseColor = "#BADA55";
  }

  firstUpdated() {
    this.root = this.shadowRoot;
    if (!this.root) return;
    if (!this.radix) this.radix = Math.abs(this.size / 4);
    this.radix = Math.min(this.radix, Math.floor(this.size - 1) / 2);
    const externalInput = this.slottedChildren;
    this.setCSSProperty("--size", this.size);
    this.style.setProperty("--size", this.size);
    this.setCSSProperty("--radix", this.radix);
    this.setCSSProperty("--base-color", this.baseColor);
    this.createColors(externalInput);
    this.createClipPath(this.radix);
  }

  createColors(externalInput) {
    const count = externalInput.length;
    const diff = Math.round(80 / count);
    for (let i = 1; i <= count; i++) {
      const newColor = `hsl(from var(--base-color) ${
        i % 2 === 0 ? "h" : "calc(h - 40)"
      } calc(80 - ${diff * i}) l)`;
      const newName = `--color-${i}`;
      this.setCSSProperty(newName, externalInput[i - 1].color ?? newColor);
    }
    this.setConicGradient(externalInput);
  }

  setConicGradient(data) {
    const sum = data.reduce((sum, lgnd) => sum + lgnd.value, 0);
    const percentages = [
      ...data.map((lgnd) => Math.round((lgnd.value / sum) * 100)),
    ];
    const additativePercentages = percentages.reduce(
      (curr, val) => {
        return [...curr, curr.at(-1) + val];
      },
      [0],
    );
    let conicGradient = "conic-gradient(";
    for (let i = 0; i < percentages.length; i++) {
      conicGradient += `var(--color-${i + 1}) ${additativePercentages[i]}% ${
        additativePercentages[i + 1]
      }%, `;
      // set ledgend label rotation while here
      const middle =
        Math.round(
          360 * (additativePercentages[i] + percentages[i] / 2) * 0.01,
        ) - 90;
      const ledgendEl = this.slottedChildren[i];
      ledgendEl.style.setProperty("--middle", middle + "deg");
      ledgendEl.style.setProperty(
        "--counter-rotate-label",
        middle * -1 + "deg",
      );
      ledgendEl.style.setProperty(
        "--tr-origin",
        middle > 180 - 90 ? "right" : "left",
      ); //110% -50%
      ledgendEl.style.setProperty(
        "--translate",
        middle > 180 - 90 ? "0 0" : "110% -50%",
      );
    }
    conicGradient = conicGradient.slice(0, -2) + ")";
    this.setCSSProperty("--conic-gradient", conicGradient);
  }

  setCSSProperty(name, value) {
    const donut = this.root.querySelector(".donut");
    donut?.style.setProperty(name, value);
    if (!["--size", "--radix"].includes(name)) return;
    this.slottedChildren.forEach((el) => el.style.setProperty(name, value));
  }

  createClipPath(radix = 80) {
    const path = `"M 0 0 H ${this.size} V ${this.size} H 0 Z M ${Math.round(
      this.size / 2,
    )} ${Math.round(this.size / 2)} m ${
      radix * -1
    }, 0 a ${radix},${radix} 0 1,0 ${radix * 2},0 a ${radix},${radix} 0 1,0 ${
      radix * -2
    },0 Z"`;
    this.setCSSProperty("--clip-path", path);
  }

  render() {
    return html`
      <div class="donut"></div>
      <slot></slot>
    `;
  }
}
customElements.define("ui-chart", UiChart);

// ------------------------

class UiChartLedgend extends BaseClass {
  static properties = {
    label: { type: String },
    value: { type: Number },
    color: { type: String },
    colorMix: { type: String, attribute: "color-mix" },
  };

  static styles = css`
    :host {
      --thickness: calc(var(--size) / 2 - var(--radix));
      --line-start: calc(
        (var(--thickness) / 2 + (var(--radix) + var(--dot-size))) * 1px
      );
      --legends-offset: 25;
      --dotSize: 10;
      display: block;
      contain: none;
      box-sizing: border-box;
      width: calc((var(--size) / 2 + var(--legends-offset)) * 1px);
      height: 1px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform-origin: left;
      transform: rotate(var(--middle));

      &::after {
        content: "";
        width: calc(var(--dot-size) * 1px);
        height: calc(var(--dot-size) * 1px);
        background-color: currentColor;
        border-radius: 50%;
        position: absolute;
        left: calc((var(--line-start) - calc(var(--dot-size)) * 1px));
        top: 0%;
        transform-origin: right;
        transform: translate(0%, calc(-50% + 1px));
        mix-blend-mode: var(--color-mix, none);
      }
    }

    div {
      position: relative;
      width: 100%;
      border-bottom: 1px solid currentColor;
      mix-blend-mode: var(--color-mix, none);
      clip-path: inset(-200px -200px -200px var(--line-start));

      /*&::after {
          content: "";
          width: calc(var(--dot-size) * 1px);
          height: calc(var(--dot-size) * 1px);
          background-color: currentColor;
          border-radius: 50%;
          position: absolute;
          left: var(--line-start);
          top: 0%;
          transform-origin: right;
          transform: translate(0%, calc(-50% + 1px));
          mix-blend-mode: var(--color-mix, none);
        }*/

      &::before {
        content: attr(data-label);
        position: absolute;
        right: 0;
        top: 0;
        font-size: clamp(0.7em, calc((0.0015 * var(--size) + 0.55) * 1em), 1em);
        font-family: monospace;
        transform-origin: var(--tr-origin);
        rotate: var(--counter-rotate-label);
        translate: var(--translate);
        line-height: 1.2;
        white-space: nowrap;
        mix-blend-mode: var(--color-mix, none);

        :host([wrap]) & {
          white-space: wrap;
        }
      }
    }
  `;

  constructor() {
    super();
    this.label = "Label missing";
  }

  firstUpdated() {
    const root = this.shadowRoot;
    root.querySelector("div").dataset.label = this.label;
    const dotSize = this.constrainValueRange(
      100,
      300,
      this.style.getPropertyValue("--size"),
      4,
      10,
    );
    this.style.setProperty("--dot-size", dotSize);
    this.style.setProperty("--color-mix", this.colorMix ?? "none");
  }

  constrainValueRange(minIn, maxIn, value, minOut, maxOut) {
    const clampedValue = Math.max(minIn, Math.min(maxIn, value));
    const slope = (maxOut - minOut) / (maxIn - minIn);
    const result = minOut + slope * (clampedValue - minIn);
    const clampResult = Math.max(minOut, Math.min(maxOut, result));
    return clampResult;
  }

  render() {
    return html` <div><slot></slot></div> `;
  }
}
customElements.define("ui-chart-ledgend", UiChartLedgend);

// ------------------------

// const clampingCSS = css`
// :host {
//     --slope: calc((var(--max-out) - var(--min-out)) / (var(--max-in) - var(--min-in)));
//     --result: calc(var(--min-out) + var(--slope) * (var(--value) - var(--min-in)));
//     --clamp-result: clamp(var(--min-out), var(--max-out), var(--result));
// }
// `;
