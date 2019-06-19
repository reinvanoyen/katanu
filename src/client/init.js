"use strict";

import { websocket } from '../shared/config/network';
import EventManager from '../shared/event-manager';
import msg from '../shared/socket-messages';
import Client from '../shared/client';

import GlobalSay from './ui/global-say';

import ECS from 'tnt-ecs';

import Renderer from '../shared/ecs/system/renderer';
import Movement from '../shared/ecs/system/movement';
import Targetting from '../shared/ecs/system/targetting';
import Input from '../shared/ecs/system/input';
import Position from '../shared/ecs/component/position';
import Velocity from '../shared/ecs/component/velocity';
import Target from '../shared/ecs/component/target';
import Control from '../shared/ecs/component/control';
import Disc from '../shared/ecs/component/disc';
import Color from '../shared/ecs/component/color';
import VisualName from '../shared/ecs/component/visual-name';

import EntityManager from '../shared/entity-manager';
import createPlayer from "../shared/assemblage/player";

// Websocket
let ws = new WebSocket(`ws://${websocket.host}:${websocket.port}`);

// ECS
const ecs = new ECS.Core();
let renderer;
ecs.addSystem((renderer = new Renderer(window.innerWidth, window.innerHeight)));
ecs.addSystem(new Input(renderer.canvas));
ecs.addSystem(new Targetting());
ecs.addSystem(new Movement());

// Run loop
(function run() {
  requestAnimationFrame(() => {
    ecs.update();
    run();
  });
})();

// User interface
const global = new GlobalSay();
document.body.appendChild(global.build());

global.addMessage('System', 'Connecting...');

ws.onopen = () => {
  global.addMessage('System', 'Connected');
  connected(ws);
};

ws.onerror = (error) => {
  global.addMessage('System', 'Connection failed');
};

function connected() {

  const client = new Client(ws);

  ws.onmessage = (message) => {
    client.received(message);
  };

  EventManager.on('start', e => {
    client.send({
      action: msg.START,
      clientId: client.getId()
    });
  });

  EventManager.on('stop', e => {
    client.send({
      action: msg.STOP,
      clientId: client.getId()
    });
  });

  EventManager.on('sendMessage', e => {
    client.send({
      action: msg.CL_SAY,
      clientId: client.getId(),
      message: e.message
    });
  });

  EventManager.on('componentUpdate', e => {
    e.action = msg.COMPONENT_UPDATE;
    e.clientId = client.getId();
    client.send(e);
  });

  // Client connected
  EventManager.on(msg.SV_CLIENT_CONNECTED, e => {

    let newEntity = createPlayer(e.clientId);

    // It us us!
    if (client.getId() === e.clientId) {
      newEntity.addComponent(new Control());
    }

    ecs.addEntity(newEntity);

    EntityManager.add(e.clientId, newEntity);
  });

  // Client disconnected
  EventManager.on(msg.SV_CLIENT_DISCONNECTED, e => {

    let entity = EntityManager.get(e.clientId);

    if (entity) {
      ecs.removeEntity(entity);
      EntityManager.remove(e.clientId);
    }
  });

  // Client says
  EventManager.on(msg.CL_SAY, e => {

    let entity = EntityManager.get(e.clientId);

    if (entity && entity.components.visualName) {
      entity.components.visualName.text = e.message;
    }
  });

  // Client component update
  EventManager.on(msg.COMPONENT_UPDATE, e => {

    let entity = EntityManager.get(e.clientId);

    if (entity) {
      if (entity.components[e.component]) {
        Object.assign(entity.components[e.component], entity.components[e.component], e.data);
      }
    }
  });

  // Client receives world state
  EventManager.on(msg.SV_WORLD_STATE, e => {

    for (let id in e.entities) {

      if (id !== client.getId()) {

        let newEntity = createPlayer(id);

        for (let componentName in e.entities[id].components) {
          if (newEntity.components[componentName]) {
            let componentData = e.entities[id].components[componentName];
            Object.assign(newEntity.components[componentName], newEntity.components[componentName], componentData);
          }
        }

        ecs.addEntity(newEntity);

        EntityManager.add(id, newEntity);
      }
    }
  });
}