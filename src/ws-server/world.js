"use strict";

import EntityManager from "../shared/entity-manager";
import createPlayer from "../shared/assemblage/player";
import msg from "../shared/socket-messages";
import math from "../shared/util/math";

export default class World {

  constructor(server) {

    this.timer = 0;
    this.server = server;
    this.entities = {};

    this.isRunning = false;
    this.tickTimeout = null;
  }

  start() {

    if (! this.isRunning) {

      this.server.broadcast({
        action: msg.TICK,
        data: {
          gameState: 'Starting...'
        }
      });

      this.isRunning = true;
      this.spawnBots();
      this.tick();
    }
  }

  stop() {

    if (this.isRunning) {

      this.server.broadcast({
        action: msg.TICK,
        data: {
          gameState: 'Not started'
        }
      });

      clearTimeout(this.tickTimeout);
      this.removeBots();
      this.isRunning = false;
      this.timer = 0;
    }
  }

  tick() {

    this.tickTimeout = setTimeout(() => {

      for (let id in this.entities) {
        this.performRandomAction(id);
      }

      this.timer++;

      this.server.broadcast({
        action: msg.TICK,
        data: {
          gameState: this.timer+'s'
        }
      });

      this.tick();

    }, 1000);
  }

  performRandomAction(entityId) {

    let rand = math.randBetween(0, 3);

    if (rand === 1) {

      this.server.broadcast({
        action: msg.COMPONENT_UPDATE,
        component: 'color',
        data: {
          r: math.randBetween(0, 255),
          g: math.randBetween(0, 255),
          b: math.randBetween(0, 255)
        },
        clientId: entityId
      });

    } else if (rand === 2) {

      this.server.broadcast({
        action: msg.COMPONENT_UPDATE,
        component: 'disc',
        data: {
          radius: math.randBetween(5, 20)
        },
        clientId: entityId
      });

    } else {

      this.server.broadcast({
        action: msg.COMPONENT_UPDATE,
        component: 'target',
        data: {
          x: math.randBetween(25, 1000),
          y: math.randBetween(25, 800)
        },
        clientId: entityId
      });
    }
  }

  removeBots() {

    for (let id in this.entities) {

      EntityManager.remove(id);

      this.server.broadcast({
        action: msg.SV_CLIENT_DISCONNECTED,
        clientId: id
      });
    }
  }

  spawnBots() {

    for (let i = 0; i < 5; i++) {
      this.spawnBot(i);
    }
  }

  spawnBot(entityId) {

    // Prefix the entity id
    entityId = 'bot'+entityId;

    let entity = createPlayer(entityId);

    this.entities[entityId] = entity;

    // Add client entity to entity manager
    EntityManager.add(entityId, entity);

    // Connect the bot
    this.server.broadcast({
      action: msg.SV_CLIENT_CONNECTED,
      clientId: entityId
    });
  }
}