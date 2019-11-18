import * as dotenv from 'dotenv';
import * as express from 'express';
import * as morgan from 'morgan';
import * as mongoose from 'mongoose';
import * as path from 'path';

import setRoutes from './routes';


const app = express();
const bodyParser = require("body-parser");
//var server = app.listen(3000);
dotenv.config();
//require the http module
const http = require('http').Server(app)

// require the socket.io module

const port = process.env.PORT || 3000;
var server = app.listen(port)

//socket.io instantiation
const socket = require("socket.io")(server)

//app.set('port', (process.env.PORT || 3000));


app.use('/', express.static(path.join(__dirname, '../public')));
app.use(express.json());
//bodyparser middleware
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

let mongodbURI;
if (process.env.NODE_ENV === 'test') {
  mongodbURI = process.env.MONGODB_TEST_URI;
} else {
  mongodbURI = process.env.MONGODB_URI;
  app.use(morgan('dev'));
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
socket.on("connection", socket => {
  console.log("user connected");

  socket.on("disconnect", function() {
    console.log("user disconnected");
  });

  socket.on("message", message => {
    console.log("Message Received: " + message);
    // io.emit("message", { type: "new-message", text: message });
    socket.broadcast.emit("message", { type: "new-message", text: message });
  });
});



export { app };
