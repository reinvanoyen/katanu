"use strict";

import WebSocket from 'ws';
import msg from '../shared/socket-messages';
import Client from '../shared/client';
import EntityManager from "../shared/entity-manager";
import createPlayer from "../shared/assemblage/player";
import EventManager from "../shared/event-manager";

export default class Server {

  static create(port = 8080) {

    this.currentClientId = 0;
    this.clients = {};
    this.clientCount = 0;
    this.wss = new WebSocket.Server({ port: port });

    Server.registerEvents();

    return Server;
  }

  static registerEvents() {

    this.wss.on('connection', ws => {

      this.currentClientId++;
      let client = new Client(ws);
      client.setId(this.currentClientId);
      this.connectClient(client);

      ws.on('close', (message) => {
        this.disconnectClient(client);
      });

      ws.on('message', (message) => {
        this.received(message);
      });

      ws.on('error', (e) => {
        this.disconnectClient(client);
      });
    });
  }

  static send(clientId, data) {
    this.clients[clientId].send(data);
  }

  static broadcast(data) {
    for (let id in this.clients) {
      this.clients[id].send(data);
    }
  }

  static disconnectClient(client) {

    if (this.clients[client.getId()]) {

      this.clients[client.getId()].disconnect();
      delete this.clients[client.getId()];
      this.clientCount--;

      this.broadcast({
        action: msg.SV_CLIENT_DISCONNECTED,
        clientId: client.getId()
      });

      this.broadcast({
        action: msg.SV_SAY,
        message: 'Client (' + client.getId() + ') has disconnected'
      });

      EntityManager.remove(client.getId());
    }
  }

  static connectClient(client) {

    this.clients[client.getId()] = client;
    client.connect();

    // Send a handshake
    this.send(client.getId(), {
      action: msg.SV_HANDSHAKE,
      clientId: client.getId()
    });

    this.clientCount++;

    this.broadcast({
      action: msg.SV_CLIENT_CONNECTED,
      clientId: client.getId()
    });

    this.broadcast({
      action: msg.SV_SAY,
      message: 'Client (' + client.getId() + ') has connected'
    });

    // Send the world state to the just connected client
    this.send(client.getId(), {
      action: msg.SV_WORLD_STATE,
      entities: EntityManager.entities
    });

    // Add client entity to entity manager
    EntityManager.add(client.getId(), createPlayer(client.getId()));
  }

  static received(message) {

    let data = JSON.parse(message);

    EventManager.trigger(msg.SERVER_RECEIVED_MESSAGE, {
      data: data
    });

    if (data.action === msg.CL_SAY || data.action === msg.COMPONENT_UPDATE) {

      // Broadcast the message
      this.broadcast(data);

      // If it's a component update, also update the component
      if (data.action === msg.COMPONENT_UPDATE) {

        let entity = EntityManager.get(data.clientId);

        if (entity) {
          Object.assign(entity.components[data.component], entity.components[data.component], data.data);
        }
      }
    }
  }
}