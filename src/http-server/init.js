"use strict";

import express from 'express';
import path from 'path';
import { http } from '../shared/config/network';

const app = express();
const port = http.port;

// serves all the static files
app.get(/^(.+)$/, (req, res) => {
  console.log('Static file request: ' + req.params[0]);
  res.sendFile(path.join(__dirname, '../../static' + req.params[0]));
});

app.listen(port, () => {
  console.log('Listening on ' + port);
});