class MessageKeyboard extends HTMLElement {
  constructor() {
    super();
    let shadow = this.attachShadow({mode: 'open'});
    let tmpl = document.getElementById('message-keyboard');

    this.text = '';
    shadow.appendChild(tmpl.content);
    this.el = shadow.querySelector('textarea')
  }

  static get observedAttributes() {
    return ['text'];
  }

  makeSendEvent () {
    let context = this;
    return new CustomEvent("messageKeyboardSend", {
      bubbles: true,
      cancelable: false,
      composed: true,
      detail: context.el.value
    });
  }

  connectedCallback () {
    let context = this;
    this.el.addEventListener('keypress', function(e) { context.onKeypress(e); });
  }

  disconnectedCallback () {
    let context = this;
    this.el.removeEventListener('keypress', function(e) { context.onKeypress(e); });
  }

  attributeChangedCallback (key, oldVal, newVal) {
    this.el.value = newVal;
  }

  onKeypress (e) {
    e.stopPropagation();
    if (e.shiftKey && e.key === "Enter") {

    } else if (e.key === "Enter") {
      e.preventDefault();
      if (this.el.value) {
        this.dispatchEvent(this.makeSendEvent());
        this.text = '';
        this.el.value = '';
      }
      return; 
    }
  }
}

class MessageLog extends HTMLElement {
  constructor() {
    super();
    let shadow = this.attachShadow({mode: 'open'});
    let tmpl = document.getElementById('message-log');
    this.log = ['type some messages'];
    this.logged = 0;
    this.logSize = 500;
    this._eventHandle = this.onMessage.bind(this);
    shadow.appendChild(tmpl.content);
  }

  logMessage (text) {
    this.log.push(text);
    this.logged++;
  }

  writeMessage (text) {
    let log = document.createElement('p');
    log.innerText = text;
    this.shadowRoot.querySelector('.log-view').appendChild(log);
  }

  scroll () {
    window.test = this;
    this.shadowRoot.host.scrollTop = this.shadowRoot.host.scrollHeight;
  }

  connectedCallback () {
    console.log(this.log.length);
    for (var i = 0; i < this.log.length; i++) {
      this.writeMessage(this.log[i]);
    }
    document.addEventListener('messageKeyboardSend', this._eventHandle);
  }

  disconnectedCallback () {
    document.removeEventListener('messageKeyboardSend', this._eventHandle);
  }

  onMessage (e) {
    this.logMessage(e.detail);
    this.writeMessage(e.detail);
    this.scroll();
  }
}

customElements.define('message-keyboard', MessageKeyboard);
customElements.define('message-log', MessageLog);
