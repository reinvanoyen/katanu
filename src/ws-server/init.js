"use strict";

import Server from './server';
import { websocket } from '../shared/config/network';
import World from "./world";
import EventManager from "../shared/event-manager";
import msg from "../shared/socket-messages";

Server.create(websocket.port);

let world = new World(Server);

EventManager.on(msg.SERVER_RECEIVED_MESSAGE, e => {

  if (e.data.action === msg.START) {

    world.start();

  } else if(e.data.action === msg.STOP) {

    world.stop();
  }
});