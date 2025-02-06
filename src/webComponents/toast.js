import { html, css } from "lit";
import { BaseClass } from "./baseClass.js";

export class UiToast extends BaseClass {
  static properties = {
    timer: { type: Number },
    closable: { type: Boolean },
  };

  static styles = css`
    :host {
      display: block;
      contain: content;
      box-sizing: border-box;
    }
  `;

  constructor() {
    super();
    this.timer = 5;
    this.closable = false;
  }

  firstUpdated() {
    const singleton = new Singleton(this.getRootNode());
    singleton.addData({
      text: this.slottedText,
      timer: this.timer,
      closable: this.closable,
      originEl: this,
    });
  }

  render() {
    return html` <div><slot></slot></div> `;
  }
}
customElements.define("ui-toast", UiToast);

class UiAlert extends BaseClass {
  static properties = {
    timer: { type: Number },
    closable: { type: Boolean },
  };

  static styles = css`
    :host {
      background-color: white;
      border-radius: 3px;
      border: 1px solid #666;
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.4);
      box-sizing: border-box;
      color: #313131;
      contain: content;
      display: block;
      margin-top: 0.5rem;
      padding: 1rem;
      pointer-events: all;
      transform-origin: bottom right;
    }

    div {
      display: flex;
      justify-content: space-between;
    }

    button {
      border-radius: 50%;
      aspect-ratio: 1/1;
      width: 20px;
      border: none;
      background-color: #999;

      &:hover {
        background-color: #666;
      }
    }
  `;

  constructor() {
    super();
    this.timer = 0;
    this.closable = false;
    this.originEl = null;
  }

  firstUpdated() {
    const anim = this.animate(
      [
        {
          opacity: "0",
          height: "0",
          margin: "0rem",
          transform: "translateX(100%) scaleY(0)",
        },
        {
          opacity: "0",
          height: "0",
          margin: "0rem",
          transform: "translateX(100%) scaleY(0)",
        },
        {
          opacity: "1",
          height: "calc-size(auto)",
          margin: "0.5rem",
          transform: "translateX(0%) scaleY(1)",
        },
      ],
      400,
    );
    anim.onfinish = () => {
      if (this.timer > 0) setTimeout(this.removeToast, this.timer * 1000);
    };
  }

  removeToast = () => {
    const anim = this.animate(
      [
        {
          opacity: 1,
          height: "calc-size(auto)",
          margin: "0.5rem",
          transform: "translateX(0%) scaleY(1)",
        },
        {
          opacity: 1,
          height: "calc-size(auto)",
          margin: "0.5rem",
          transform: "translateX(100%) scaleY(0)",
        },
        {
          opacity: 0,
          height: "0",
          margin: "0",
          transform: "translateX(100%) scaleY(0)",
        },
      ],
      500,
    );
    anim.onfinish = () => {
      this.remove();
      if (this.originEl) this.originEl.remove();
    };
  };

  render() {
    return html`
      <div>
        <div><slot></slot></div>
        ${this.closable
          ? html` <button @click="${this.removeToast}">✕</button> `
          : ""}
      </div>
    `;
  }
}
customElements.define("ui-alert", UiAlert);

class UiToastWrapper extends BaseClass {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      /*contain: content;*/
      box-sizing: border-box;
      padding: 2rem 0.5rem 0.5rem 0.5rem;
      background-color: transparent;
      border: 0px solid transparent;
      position: fixed;
      bottom: 1rem;
      right: 1rem;
      width: 500px;
      min-height: 40px;
      margin: 0;
      left: unset;
      top: unset;
      pointer-events: none;
    }
  `;

  firstUpdated() {
    this._initiateSlotChangeObserver(() => {
      if (this.slottedChildren.length === 0) this.remove();
    });
  }

  render() {
    return html` <div><slot></slot></div> `;
  }
}
customElements.define("ui-toast-wrapper", UiToastWrapper);

// ------------------------

class Singleton {
  static data;
  static root;
  static instance;

  constructor(root) {
    this.data = [];
    this.root = root;

    if (Singleton.instance) {
      return Singleton.instance;
    }

    Singleton.instance = this;
  }

  hasToasts() {
    return this.data.length > 0;
  }

  popToast() {
    return this.data.pop();
  }

  getData() {
    return this.data;
  }

  setData(data) {
    this.data = data;
  }

  addData(data) {
    console.log(data);
    this.data = [...this.data, data];
    this.udpateUI();
  }

  udpateUI() {
    const toastWrapperEl = createWrapper(this.root);
    populateContainer();

    function populateContainer() {
      const singleton = new Singleton();
      const toasts = singleton.getData();

      while (singleton.hasToasts()) {
        const toastData = singleton.popToast();
        if (!toastData) return;
        const toastAlert = document.createElement("ui-alert");
        toastAlert.setAttribute("timer", toastData.timer.toString());
        if (toastData.closable) toastAlert.setAttribute("closable", "true");
        toastAlert.originEl = toastData.originEl;
        toastAlert.innerText = String(toastData.text);
        toastWrapperEl.appendChild(toastAlert);
      }
    }

    function createWrapper(root) {
      const body = root.querySelector("body");
      let toastWrapperEl = body.querySelector("ui-toast-wrapper");
      if (!toastWrapperEl) {
        toastWrapperEl = document.createElement("ui-toast-wrapper");
        toastWrapperEl.setAttribute("popover", "manual");
        body.appendChild(toastWrapperEl);
      }
      return toastWrapperEl;
    }
  }
}

// -------------------------
// Helpers
// -------------------------

const wait = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
