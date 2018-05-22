"use strict";

import { websocket } from '../shared/config/network';
import EventManager from '../shared/event-manager';
import msg from '../shared/socket-messages';
import Client from '../shared/client';

import GlobalSay from './ui/global-say';

import ECS from 'tnt-ecs';

import Renderer from './ecs/system/renderer';
import Movement from './ecs/system/movement';
import Targetting from './ecs/system/targetting';
import Input from './ecs/system/input';
import Position from './ecs/component/position';
import Velocity from './ecs/component/velocity';
import Target from './ecs/component/target';
import Control from './ecs/component/control';
import Disc from './ecs/component/disc';
import Color from './ecs/component/color';
import VisualName from './ecs/component/visual-name';

import EntityManager from './entity-manager';

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

    let newEntity = new ECS.Entity([
      new Color(),
      new Position(),
      new Disc(),
      new Velocity(),
      new Target(),
      new VisualName({text: 'Client ' + e.clientId})
    ]);

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
}