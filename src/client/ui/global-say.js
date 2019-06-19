"use strict";

import msg from '../../shared/socket-messages';
import EventManager from '../../shared/event-manager';
import math from '../../shared/util/math';

export default class GlobalSay {

  build() {

    this.gameState = document.createElement('div');
    this.gameState.style.position = 'fixed';
    this.gameState.style.top = 0;
    this.gameState.style.left = 0;
    this.gameState.style.width = '100%';
    this.gameState.style.color = '#ffffff';
    this.gameState.style.fontFamily = 'monospace';
    this.gameState.style.fontSize = '35px';
    this.gameState.style.textAlign = 'center';
    this.gameState.textContent = 'Not started';
    document.body.appendChild(this.gameState);

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

    // Start / stop button

    this.startButton = document.createElement('button');
    this.startButton.textContent = 'start';

    this.stopButton = document.createElement('button');
    this.stopButton.textContent = 'stop';

    this.startButton.addEventListener('click', e => {
      EventManager.trigger('start');
    });

    this.stopButton.addEventListener('click', e => {
      EventManager.trigger('stop');
    });

    this.globalSayEl.appendChild(this.startButton);
    this.globalSayEl.appendChild(this.stopButton);

    // Name input
    this.input = document.createElement('input');
    this.input.value = 'Unnamed';
    this.globalSayEl.appendChild(this.input);

    this.input.addEventListener('keyup', e => {
      EventManager.trigger('sendMessage', {
        message: e.currentTarget.value
      });
    });

    // Abilities
    document.addEventListener('keyup', e => {

      if (e.keyCode === 49) {

        EventManager.trigger('componentUpdate', {
          component: 'color',
          data: {
            r: math.randBetween(0, 255),
            g: math.randBetween(0, 255),
            b: math.randBetween(0, 255)
          }
        });
      }

      if (e.keyCode === 50) {

        EventManager.trigger('componentUpdate', {
          component: 'disc',
          data: {
            radius: math.randBetween(5, 25)
          }
        });
      }
    });

    EventManager.on(msg.TICK, e => {
      this.gameState.textContent = e.data.gameState;
    });

    EventManager.on(msg.CL_SAY, e => {
      //this.addMessage(e.clientId, e.message);
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