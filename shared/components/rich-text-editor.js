export class RichTextEditor extends HTMLDivElement {
  get valueAsHTML() {
    return this.querySelector(".content").innerHTML;
  }
  get valueAsText() {
    return this.querySelector(".content").innerText;
  }

  set valueAsHTML(newValue) {
    this.querySelector(".content").innerHTML = newValue;
  }
  set valueAsText(newValue) {
    this.querySelector(".content").innerText = newValue;
  }

  constructor() {
    super();

    this.classList.add("rich-text-editor");

    this.innerHTML = `
      <div class="toolbars">
        <div class="toolbar">
          <span class="triple">
            <select class="set-style">
              <option selected></option>
              <option value="div">Body</option>
              <option value="h1">Title 1</option>
              <option value="h2">Title 2</option>
              <option value="h3">Title 3</option>
              <option value="h4">Title 4</option>
              <option value="h5">Title 5</option>
              <option value="h6">Subtitle</option>
              <option value="p">Paragraph</option>
              <option value="pre">Preformatted</option>
            </select>
            <select class="set-font">
              <option selected></option>
              <option>Arial</option>
              <option>Arial Black</option>
              <option>Calibri</option>
              <option>Ubuntu</option>
              <option>Courier New</option>
              <option>Times New Roman</option>
            </select>
            <select class="set-font-size">
              <option selected></option>
              <option value="1">Very small</option>
              <option value="2">A bit small</option>
              <option value="3">Normal</option>
              <option value="4">Medium-large</option>
              <option value="5">Big</option>
              <option value="6">Very big</option>
              <option value="7">Maximum</option>
            </select>
          </span>
          <span class="double">
            <select class="set-font-color">
              <option selected></option>
              <option value="red">Red</option>
              <option value="blue">Blue</option>
              <option value="green">Green</option>
              <option value="black">Black</option>
            </select>
            <select class="set-font-background">
              <option selected></option>
              <option value="red">Red</option>
              <option value="green">Green</option>
              <option value="black">Black</option>
            </select>
          </span>
          <span class="triple">
            <img class="bold" title="Bold" src="/shared/images/bold.svg" />
            <img class="italic" title="Italic" src="/shared/images/italic.svg" />
            <img class="underline" title="Underline" src="/shared/images/underline.svg" />
          </span>
          <span class="double">
            <img class="undo" title="Undo" src="/shared/images/undo.svg" />
            <img class="redo" title="Redo" src="/shared/images/redo.svg" />
          </span>
          <span class="double">
            <img class="remove-formatting" title="Remove formatting" src="/shared/images/clear-formatting.svg" />
          </span>
        </div>
        <div class="toolbar">
          <span class="triple">
            <img class="left-align" title="Left align" src="/shared/images/align-left.svg" />
            <img class="center-align" title="Center align" src="/shared/images/align-center.svg" />
            <img class="right-align" title="Right align" src="/shared/images/align-right.svg" />
          </span>
          <span class="double">
            <img class="numbered-list" title="Numbered list" src="/shared/images/bullet-numbers.svg" />
            <img class="dotted-list" title="Dotted list" src="/shared/images/bullet-points.svg" />
          </span>
          <span class="triple">
            <img class="cut" title="Cut" src="/shared/images/cut.svg" />
            <img class="copy" title="Copy" src="/shared/images/copy.svg" />
            <img class="paste" title="Paste" src="/shared/images/paste.svg" />
          </span>
          <span class="double">
            <img class="indent" title="Add indentation" src="/shared/images/indent.svg" />
            <img class="outdent" title="Delete indentation" src="/shared/images/outdent.svg" />
          </span>
          <span class="triple">
            <img class="quote" title="Quote" src="/shared/images/quote.svg" />
            <img class="add-hyperlink" title="Hyperlink" src="/shared/images/url.svg" />
            <img class="toggle-code" title="View code" src="/shared/images/code.svg" />
          </span>
        </div>
      </div>

      <div class="content" contenteditable="true">
        <p></p>
      </div>`;

    this.querySelector(".add-hyperlink").addEventListener("click", () => {
      var sLnk = prompt("Write the URL here", "http://");

      if (sLnk && sLnk != "" && sLnk != "http://") {
        this.formatDoc("createlink", sLnk);
      }
    });

    this.querySelector(".set-font").addEventListener("change", (e) => {
      this.formatDoc("fontname", e.target.value);
      e.target.selectedIndex = 0;
    });

    this.querySelector(".set-font-size").addEventListener("change", (e) => {
      this.formatDoc("fontsize", e.target.value);
      e.target.selectedIndex = 0;
    });

    this.querySelector(".set-font-color").addEventListener("change", (e) => {
      this.formatDoc("forecolor", e.target.value);
      e.target.selectedIndex = 0;
    });

    this.querySelector(".set-font-background").addEventListener("change", (e) => {
      this.formatDoc("backcolor", e.target.value);
      e.target.selectedIndex = 0;
    });

    this.querySelector(".set-style").addEventListener("change", (e) => {
      this.formatDoc("formatblock", e.target.value);
      e.target.selectedIndex = 0;
    });

    this.querySelector(".toggle-code").addEventListener("click", (e) =>
      this.setDocMode(e.target.classList.contains("checked"))
    );
    this.querySelector(".cut").addEventListener("click", () => this.formatDoc("cut"));
    this.querySelector(".copy").addEventListener("click", () => this.formatDoc("copy"));
    this.querySelector(".paste").addEventListener("click", () => this.formatDoc("paste"));
    this.querySelector(".quote").addEventListener("click", () => this.formatDoc("formatblock", "blockquote"));
    this.querySelector(".indent").addEventListener("click", () => this.formatDoc("indent"));
    this.querySelector(".outdent").addEventListener("click", () => this.formatDoc("outdent"));
    this.querySelector(".numbered-list").addEventListener("click", () => this.formatDoc("insertorderedlist"));
    this.querySelector(".dotted-list").addEventListener("click", () => this.formatDoc("insertunorderedlist"));
    this.querySelector(".left-align").addEventListener("click", () => this.formatDoc("justifyleft"));
    this.querySelector(".center-align").addEventListener("click", () => this.formatDoc("justifycenter"));
    this.querySelector(".right-align").addEventListener("click", () => this.formatDoc("justifyright"));
    this.querySelector(".bold").addEventListener("click", () => this.formatDoc("bold"));
    this.querySelector(".italic").addEventListener("click", () => this.formatDoc("italic"));
    this.querySelector(".underline").addEventListener("click", () => this.formatDoc("underline"));
    this.querySelector(".undo").addEventListener("click", () => this.formatDoc("undo"));
    this.querySelector(".redo").addEventListener("click", () => this.formatDoc("redo"));
    this.querySelector(".remove-formatting").addEventListener("click", () => this.formatDoc("removeFormat"));
  }

  formatDoc(sCmd, sValue) {
    document.execCommand(sCmd, false, sValue);
    this.querySelector(".content").focus();
  }

  setDocMode(bToSource) {
    const content = this.querySelector(".content");
    this.querySelector(".toggle-code").classList.toggle("checked");

    if (bToSource) {
      const oContent = document.createTextNode(content.innerHTML);
      const oPre = document.createElement("pre");

      content.innerHTML = "";
      content.contentEditable = false;

      oPre.classList.add("source-text");
      oPre.contentEditable = true;
      oPre.appendChild(oContent);

      content.appendChild(oPre);
      document.execCommand("defaultParagraphSeparator", false, "div");
    } else {
      if (document.all) content.innerHTML = content.innerText;
      else {
        const oContent = document.createRange();

        oContent.selectNodeContents(content.firstChild);
        content.innerHTML = oContent.toString();
      }
      content.contentEditable = true;
    }

    content.focus();
  }
}

customElements.define("rich-text-editor", RichTextEditor, { extends: "div" });
