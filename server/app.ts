import * as dotenv from 'dotenv';
//import * as express from 'express';
import * as morgan from 'morgan';
import * as mongoose from 'mongoose';
//import * as path from 'path';

import setRoutes from './routes';
const express = require('express');
const socketIO = require('socket.io');
const path = require('path');

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');
const bodyParser = require("body-parser");

const app = express()
  .use((req, res) => res.sendFile(INDEX) )
  .use('/', express.static(path.join(__dirname, '../public')))
  .use(express.json())
  .use(bodyParser.json())
  .use(express.urlencoded({ extended: false }))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

const io = socketIO(app);

io.on('connection', (socket) => {
  console.log('Client connected');
  socket.on('disconnect', () => console.log('Client disconnected'));

  socket.on("message", message => {
  console.log("Message Received: " + message);
  // io.emit("message", { type: "new-message", text: message });
  io.broadcast.emit("message", { type: "new-message", text: message });
});
});



setInterval(() => io.emit('time', new Date().toTimeString()), 1000);

//var server = app.listen(3000);
dotenv.config();


let mongodbURI;
if (process.env.NODE_ENV === 'test') {
  mongodbURI = process.env.MONGODB_TEST_URI;
} else {
  mongodbURI = process.env.MONGODB_URI;
  express().use(morgan('dev'));
}

mongoose.Promise = global.Promise;


mongoose.connect(mongodbURI, { useNewUrlParser: true })
  .then(db => {
    console.log('Connected to MongoDB');

    setRoutes(app);

    app.get('/*', (req, res) => {
      res.sendFile(path.join(__dirname, '../public/index.html'));
    });

    // if (!module.parent) {
    //   app.listen(app.get('port'), () => console.log(`Angular Full Stack listening on port ${app.get('port')}`));
    // }
  })
  .catch(err => console.error(err));


  //setup event listener
// io.sockets.on("connection", socket => {
//   console.log("user connected");

//   socket.on("disconnect", function() {
//     console.log("user disconnected");
//   });

//   socket.on("message", message => {
//     console.log("Message Received: " + message);
//     // io.emit("message", { type: "new-message", text: message });
//     socket.broadcast.emit("message", { type: "new-message", text: message });
//   });
// });

export { app };
