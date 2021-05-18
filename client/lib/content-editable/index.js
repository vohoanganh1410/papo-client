import React from 'react';
import createReactClass from 'create-react-class';

// import './style.scss';

const ContentEditable = createReactClass({
  getDefaultProps() {
    return {
      onChange: function() {},
      placeholder: "",
      className: ""
    };
  },
  getInitialState() {
    return {
      text: ""
    };
  },
  getText(el) {
    return el.innerText || this.getTextForFirefox(el);
  },
  getTextForFirefox(el) {
    // Taken from http://stackoverflow.com/a/3908094
    var text = "";
    if (typeof window.getSelection != "undefined") {
      var sel = window.getSelection();
      var tempRange = sel.getRangeAt(0);
      sel.removeAllRanges();
      var range = document.createRange();
      range.selectNodeContents(el);
      sel.addRange(range);
      text = sel.toString();
      sel.removeAllRanges();
      sel.addRange(tempRange);
    }

    return text;
  },
  onTextChange(ev) {
    var text = this.getText(ev.target);
    this.setState({ text: text });
    this.props.onChange({
      target: {
        value: text
      }
    });
  },
  onPaste(ev) {
    ev.preventDefault();
    var text = ev.clipboardData.getData("text");
    document.execCommand('insertText', false, text);
  },
  getClassName() {
    var placeholder = this.state.text === "" ? "comPlainTextContentEditable__has_placeholder" : "";
    return `comPlainTextContentEditable ${placeholder} ${this.props.className}`;
  },
  render() {
    return (
      <div
        ref="content"
        contentEditable="true"
        className={ this.getClassName() }
        onPaste={ this.onPaste }
        onInput={ this.onTextChange }
        placeholder={ this.props.placeholder }
      />
    );
  }
});

export default ContentEditable;
