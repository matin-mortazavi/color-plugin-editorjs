class ColorTool {
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

  constructor({ api }) {
    this.api = api;
    this.button = null;
    this._state = false;

    this.tag = "SPAN";
    this.class = "cdx-marker";
  }

  render() {
    this.button = document.createElement("button");
    this.button.type = "button";
    this.button.innerHTML =
      '<svg width="20" height="18"><path d="M10.458 12.04l2.919 1.686-.781 1.417-.984-.03-.974 1.687H8.674l1.49-2.583-.508-.775.802-1.401zm.546-.952l3.624-6.327a1.597 1.597 0 0 1 2.182-.59 1.632 1.632 0 0 1 .615 2.201l-3.519 6.391-2.902-1.675zm-7.73 3.467h3.465a1.123 1.123 0 1 1 0 2.247H3.273a1.123 1.123 0 1 1 0-2.247z"/></svg>';
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
    // mark.style.color = "red";
    console.log(elem);
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
    this.colorPicker.value = "#f5f1cc";
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

export default ColorTool;
