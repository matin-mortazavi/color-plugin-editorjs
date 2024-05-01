export default class ColorTool {
  static get isInline() {
    return true;
  }
  static get sanitize() {
    return {
      mark: {
        class: "cdx-marker",
      },
    };
  }

  get state() {
    return this._state;
  }

  set state(state) {
    this._state = state;

    this.button.classList.toggle(this.api.styles.inlineToolButtonActive, state);
  }

  constructor({ config, api }) {
    this.config = config;
    this.api = api;
    this.button = null;
    this._state = false;

    this.tag = "SPAN";
    this.class = "cdx-marker";
  }

  render() {
    this.button = document.createElement("button");
    this.button.type = "button";
    this.button.innerHTML = this.config?.icon
      ? this.config?.icon
      : `<svg fill="#000000" height="200px" width="200px" version="1.1" id="Icons" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M17.6,6L6.9,16.7c-0.2,0.2-0.3,0.4-0.3,0.6L6,23.9c0,0.3,0.1,0.6,0.3,0.8C6.5,24.9,6.7,25,7,25c0,0,0.1,0,0.1,0l6.6-0.6 c0.2,0,0.5-0.1,0.6-0.3L25,13.4L17.6,6z"></path> <path d="M26.4,12l1.4-1.4c1.2-1.2,1.1-3.1-0.1-4.3l-3-3c-0.6-0.6-1.3-0.9-2.2-0.9c-0.8,0-1.6,0.3-2.2,0.9L19,4.6L26.4,12z"></path> </g> <g> <path d="M28,29H4c-0.6,0-1-0.4-1-1s0.4-1,1-1h24c0.6,0,1,0.4,1,1S28.6,29,28,29z"></path> </g> </g></svg>`;
    this.button.classList.add(this.api.styles.inlineToolButton);

    return this.button;
  }

  surround(range) {
    if (this.state) {
      this.unwrap(range);
      return;
    }

    this.wrap(range);
  }

  wrap(range) {
    const selectedText = range.extractContents();
    const elem = document.createElement(this.tag);

    elem.classList.add(this.class);
    elem.appendChild(selectedText);
    range.insertNode(elem);

    this.api.selection.expandToTag(elem);
  }

  unwrap(range) {
    const mark = this.api.selection.findParentTag(this.tag, this.class);
    const text = range.extractContents();

    mark.remove();

    range.insertNode(text);
  }

  checkState() {
    const mark = this.api.selection.findParentTag(this.tag);

    this.state = !!mark;

    if (this.state) {
      this.showActions(mark);
    } else {
      this.hideActions();
    }
  }

  renderActions() {
    this.colorPicker = document.createElement("input");
    this.colorPicker.type = "color";
    this.colorPicker.value = this.config?.defaultColor || "#FFF";
    this.colorPicker.hidden = true;

    return this.colorPicker;
  }

  showActions(mark) {
    const { color } = mark.style;

    this.colorPicker.value = color ? this.convertToHex(color) : "#f5f1cc";

    this.colorPicker.onchange = () => {
      mark.style.color = this.colorPicker.value;
    };
    this.colorPicker.hidden = false;
  }

  hideActions() {
    this.colorPicker.onchange = null;
    this.colorPicker.hidden = true;
  }

  convertToHex(color) {
    const rgb = color.match(/(\d+)/g);

    let hexr = parseInt(rgb[0]).toString(16);
    let hexg = parseInt(rgb[1]).toString(16);
    let hexb = parseInt(rgb[2]).toString(16);

    hexr = hexr.length === 1 ? "0" + hexr : hexr;
    hexg = hexg.length === 1 ? "0" + hexg : hexg;
    hexb = hexb.length === 1 ? "0" + hexb : hexb;

    return "#" + hexr + hexg + hexb;
  }
}
