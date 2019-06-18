"use strict";

export default class EntityManager {

  static add(clientId, entity) {

    if (!this.entities) {
      this.entities = {};
    }

    this.entities[clientId] = entity;
  }

  static remove(clientId) {

    if (!this.entities || !this.entities[clientId]) {
      return;
    }

    delete this.entities[clientId];
  }

  static get(clientId) {

    if (!this.entities || !this.entities[clientId]) {
      return;
    }

    return this.entities[clientId];
  }
}