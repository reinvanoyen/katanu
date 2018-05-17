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
import Position from './ecs/component/position';
import Velocity from './ecs/component/velocity';
import Target from './ecs/component/target';
import Disc from './ecs/component/disc';
import Color from './ecs/component/color';
import VisualName from './ecs/component/visual-name';

import EntityManager from './entity-manager';

const ecs = new ECS.Core();
ecs.addSystem(new Renderer());
ecs.addSystem(new Targetting());
ecs.addSystem(new Movement());

// Run loop
(function run() {
  requestAnimationFrame(() => {
    ecs.update();
    run();
  });
})();

// Websocket
let ws = new WebSocket(`ws://${websocket.host}:${websocket.port}`);

// ui
let clientStatus = document.createElement('span');
clientStatus.textContent = 'Joining...';
document.body.appendChild(clientStatus);

ws.onopen = () => {
  clientStatus.textContent = 'Connected';
  connected(ws);
};

ws.onerror = (error) => {
  clientStatus.textContent = 'Connection failed';
};

function connected() {

  let client = new Client(ws);

  ws.onmessage = (message) => {
    client.received(message);
  };

  let global = new GlobalSay();

  // EventManager.on('requestJoinRoom', e => {
  //
  //   client.send({
  //     action: msg.CL_JOIN_ROOM,
  //     roomIndex: e.roomIndex,
  //     playerName: e.playerName
  //   });
  // });

  EventManager.on('sendMessage', e => {

    client.send({
      action: msg.CL_SAY,
      id: client.getId(),
      message: e.message
    });
  });

  EventManager.on(msg.SV_CLIENT_CONNECTED, e => {

    let newEntity = new ECS.Entity([
      new Color({b: 255}),
      new Position(),
      new Disc({radius: 5}),
      new Velocity(),
      new Target(),
      new VisualName(e.id)
    ]);

    ecs.addEntity(newEntity);

    EntityManager.add(e.id, newEntity);
  });

  EventManager.on(msg.SV_CLIENT_DISCONNECTED, e => {

    let entity = EntityManager.get(e.id);

    if (entity) {
      ecs.removeEntity(entity);
      EntityManager.remove(e.id);
    }
  });


  EventManager.on(msg.CL_SAY, e => {

    let entity = EntityManager.get(e.id);

    if (entity) {

      if (entity.components.disc) {
        entity.components.disc.radius = ( e.message.length * 2 );
      }

      if (entity.components.target) {
        entity.components.target.y = ( e.message.length * 10 );
        entity.components.target.x = ( e.message.length * 10 );
      }

      if (entity.components.color) {
        entity.components.color.r = ( e.message.length * 10 );
      }

      if (entity.components.visualName) {
        entity.components.visualName.text = e.message;
      }
    }
  });

  document.body.appendChild(global.build());
}