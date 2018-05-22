"use strict";

import msg from '../../shared/socket-messages';
import EventManager from '../../shared/event-manager';

export default class GlobalSay {

  build() {

    this.globalSayEl = document.createElement('div');
    this.globalSayEl.style.position = 'fixed';
    this.globalSayEl.style.top = 0;
    this.globalSayEl.style.bottom = 0;
    this.globalSayEl.style.right = 0;
    this.globalSayEl.style.width = '250px';
    this.globalSayEl.style.height = '100%';
    this.globalSayEl.style.borderLeft = '3px solid black';
    this.globalSayEl.style.backgroundColor = '#ffffff';
    this.globalSayEl.style.fontFamily = 'monospace';

    this.input = document.createElement('input');
    this.globalSayEl.appendChild(this.input);

    this.input.addEventListener('keypress', e => {
      if (e.keyCode === 13) {
        EventManager.trigger('sendMessage', {
          message: e.currentTarget.value
        });
        this.input.value = '';
      }
    });

    this.propertiesEl = document.createElement('div');
    this.globalSayEl.appendChild(this.propertiesEl);

    this.colorInput = document.createElement('input');
    this.colorInput.setAttribute('type', 'color');
    this.propertiesEl.appendChild(this.colorInput);

    this.colorInput.addEventListener('change', e => {

      let value = this.colorInput.value.match(/[A-Za-z0-9]{2}/g);
      value = value.map(v => parseInt(v, 16));

      EventManager.trigger('componentUpdate', {
        'component': 'color',
        'data': {r: value[0], g: value[1], b: value[2]}
      });
    });

    this.sizeInput = document.createElement('input');
    this.sizeInput.setAttribute('type', 'range');
    this.propertiesEl.appendChild(this.sizeInput);

    this.sizeInput.addEventListener('change', e => {

      EventManager.trigger('componentUpdate', {
        'component': 'disc',
        'data': {radius: parseInt(this.sizeInput.value)}
      });
    });

    EventManager.on(msg.CL_SAY, e => {
      this.addMessage(e.clientId, e.message);
    });

    EventManager.on(msg.SV_SAY, e => {
      this.addMessage('Server', e.message);
    });

    return this.globalSayEl;
  }

  addMessage(name, message) {

    let messageEl = document.createElement('div');

    let usernameEl = document.createElement('strong');
    usernameEl.textContent = name + ': ';
    messageEl.appendChild(usernameEl);

    let contentEl = document.createElement('span');
    contentEl.textContent = message;
    messageEl.appendChild(contentEl);

    this.globalSayEl.prepend(messageEl);
  }
}