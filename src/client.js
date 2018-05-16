"use strict";

import EventManager from './shared/event-manager';
import msg from './shared/socket-messages';
import Client from './shared/client';

import ECS from 'tnt-ecs';
import Renderer from './client/ecs/system/renderer';

const ecs = new ECS.Core();
ecs.addSystem(new Renderer());

class Position extends ECS.Component {

  getName() {
    return 'position';
  }

  getDefaults() {
    return {x: 0, y: 0};
  }
}

class Disc extends ECS.Component {

  getName() {
    return 'disc';
  }

  getDefaults() {
    return {radius: 20};
  }
}

let player = new ECS.Entity([
  new Position({x: 50, y: 150}),
  new Disc()
]);

ecs.addEntity(player);

setInterval(() => {
  player.components.position.x = ( Math.random() * 800 ) + 1;
  player.components.position.y = ( Math.random() * 600 ) + 1;
  player.components.disc.radius = ( Math.random() * 100 ) + 10;
}, 1000 );

// Run loop
(function run() {
  requestAnimationFrame(() => {
    ecs.update();
    run();
  });
})();


// ui
let clientStatus = document.createElement('span');
document.body.appendChild(clientStatus);

// Websocket
let ws = new WebSocket('ws://rein.tnt.lan:8080');
clientStatus.textContent = 'Joining...';

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

  let roomIndex = new RoomIndex();
  let global = new GlobalSay();
  document.body.appendChild(roomIndex.build());

  EventManager.on('requestJoinRoom', e => {

    client.send({
      action: msg.CL_JOIN_ROOM,
      roomIndex: e.roomIndex,
      playerName: e.playerName
    });
  });

  EventManager.on('sendMessage', e => {
    client.send({
      action: msg.CL_SAY,
      message: e.message
    });
  });

  document.body.appendChild(global.build());
}