import { LitElement, html, css } from "lit";

class BaseClass extends LitElement {
  _setSlotStyles(slottedStyles) {
    if (!slottedStyles) return;
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(slottedStyles);
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
  }

  _initiateSlotChangeObserver(callback) {
    callback ??= () => console.log("slot updated");
    const slot = this.shadowRoot.querySelector("slot");
    slot.addEventListener("slotchange", callback);
  }

  get slottedChildren() {
    const slot = this.shadowRoot.querySelector("slot");
    return [...slot.assignedElements({ flatten: false })];
  }

  get slottedText() {
    const slot = this.shadowRoot.querySelector("slot");
    return slot.assignedNodes()[0].nodeValue;
  }

  emit(name, options) {
    const event = new CustomEvent(name, {
      bubbles: true,
      cancelable: false,
      composed: true,
      detail: {},
      ...options,
    });

    this.dispatchEvent(event);

    return event;
  }

  supportsDeclarativeShadowDOM() {
    return HTMLTemplateElement.prototype.hasOwnProperty("shadowRootMode");
  }

  /**
   * check for a Declarative Shadow Root
   */
  hasShadowRoot() {
    const internals = this.attachInternals();
    return internals.shadowRoot;
  }
}

// --------------------------

class UiToast extends BaseClass {
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
        { height: "0rem", opacity: "0", padding: 0, marginTop: 0 },
        {
          height: "2rem",
          height: "calc-size(auto)",
          opacity: "0",
          padding: "0.5rem",
          marginTop: "0.5rem",
        },
        { opacity: "1" },
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
        { opacity: "1" },
        {
          height: "auto",
          height: "calc-size(auto)",
          opacity: "0",
          padding: "0.5rem",
          marginTop: "0.5rem",
          transform: "translateY(-100%)",
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
