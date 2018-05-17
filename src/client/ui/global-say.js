'use strict';

import msg from '../../shared/socket-messages';
import EventManager from '../../shared/event-manager';

export default class GlobalSay {

  build() {

    this.roomContainer = document.createElement('div');

    this.input = document.createElement('input');
    this.input.style.position = 'fixed';
    this.input.style.bottom = 0;
    this.input.style.left = 0;
    this.input.style.width = '100%';
    this.input.style.height = '80px';
    this.input.style.fontSize = '22px';
    this.roomContainer.appendChild(this.input);

    this.input.addEventListener('keypress', e => {

      if (e.keyCode === 13) {
        EventManager.trigger('sendMessage', {
          message: e.currentTarget.value
        });
        this.input.value = '';
      }
    });

    EventManager.on(msg.CL_SAY, e => {
      this.addMessage(e.clientId, e.message);
    });

    EventManager.on(msg.SV_SAY, e => {
      this.addMessage('Server', e.message);
    });

    return this.roomContainer;
  }

  addMessage(name, message) {

    let messageEl = document.createElement('div');
    messageEl.textContent = name + ': ' + message;
    this.roomContainer.prepend(messageEl);
  }
}