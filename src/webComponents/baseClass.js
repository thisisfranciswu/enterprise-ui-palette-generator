import { LitElement } from "lit";

export class BaseClass extends LitElement {
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
