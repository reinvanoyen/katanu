"use strict";

import msg from './socket-messages';
import EventManager from './event-manager';

export default class Client {

  constructor(connection) {
    this.id = null;
    this.connection = connection;
    this.isConnected = false;
  }

  setId(id) {
    this.id = id;
  }

  getId() {
    return this.id;
  }

  connect() {
    this.isConnected = true;
  }

  disconnect() {
    this.isConnected = false;
  }

  send(data) {

    if (this.isConnected && this.id) {
      this.connection.send(JSON.stringify(data));
    } else {
      console.error('No can do');
    }
  }

  received(message) {

    let data = JSON.parse(message.data);

    if (data.action === msg.SV_HANDSHAKE) {
      this.connect();
      this.setId(data.clientId);
      return;
    }

    if (this.getId()) {
      EventManager.trigger(data.action, data);
    }
  }
}