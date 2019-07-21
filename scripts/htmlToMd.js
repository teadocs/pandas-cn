// @ts-nocheck

class Convert {
  constructor(options) {
    this.mainEl = $(options.el);
  }

  getChilden(el) {
    return el.children();
  }

  getMarkdown() {
    let that = this;
    let cd = this.mainEl.children();
    let content = '';
    cd.each(function(index, el) {
      content += that.parse(el);
    });
    return content;
  }

  parse(el) {
    let nodeName = el.nodeName;
    let content = '';
    console.log(nodeName);
    switch(nodeName) {
      case 'SPAN':
        content = '';
        break;
      case 'H1':
        content = `# ${this.getHtext(el)}\n`;
        break;
      case 'P':
        content = `\n${$(el).text()}\n`;
        break;
      default: 
        content = '';
        break;
    }
    return content;
  }

  getHtext(el) {
    let text = $(el).text();
    return text.replace('¶', '');
  }
}

let c = new Convert({
  el: `#io-tools-text-csv-hdf5`
});

console.log(c.getMarkdown());