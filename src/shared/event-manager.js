"use strict";

export default class EventManager {

  static on(id, call) {

    if (!this.listeners) {
      this.listeners = {};
    }
    if (!this.listeners[id]) {
      this.listeners[id] = [];
    }

    this.listeners[id].push(call);
  }

  static trigger(id, event) {

    if (!this.queue) {
      this.queue = [];
    }

    if (!this.listeners || !this.listeners[id]) {
      return;
    }

    this.listeners[id].forEach(c => c(event));
  }

  static remove(id) {

    if (this.listeners && this.listeners[id]) {
      delete this.listeners[id];
    }
  }
}