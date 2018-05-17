"use strict";

import Server from './server';
import { websocket } from '../shared/config/network';

Server.create(websocket.port);