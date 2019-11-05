import Chat from '../models/chat';
// import { app } from 'app';
// const http = require('http').Server(app)

// require the socket.io module
// const io = require('socket.io');
// const socket = io(http);



export default class ChatCtrl  {
  model = Chat;

  insert = async (req,res) => {
    console.log('uso u post')
    console.log(req.body)

    try {
      res.setHeader("Content-Type", "application/json");
      res.statusCode  =  200;
      const obj = await new Chat({ message: req.msg, sender: "Anonymous" }).save();
      console.log(obj)
      //res.status(201).json(obj);
    } catch (err) {
      console.log(err)
      //return res.status(400).json({ error: err.message });
    }
  }

  getAll = async (req, res) => {
    try {
      console.log('maria pia')
      res.setHeader("Content-Type", "application/json");
      res.statusCode  =  200;
      const docs = await this.model.find({});
      res.json(docs);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  //setup event listener
//  initSocket = socket.on("connection",  socket => {
//   console.log("user connected");

//   socket.on("disconnect", function() {
//     console.log("user disconnected");
//   });

//   //Someone is typing
//   socket.on("typing", data => {
//     socket.broadcast.emit("notifyTyping", {
//       user: data.user,
//       message: data.message
//     });
//   });

//   //when soemone stops typing
//   socket.on("stopTyping", () => {
//     socket.broadcast.emit("notifyStopTyping");
//   });

//   socket.on("chat message",async function(msg) {
//     console.log("message: " + msg);

//     //broadcast message to everyone in port:5000 except yourself.
//     socket.broadcast.emit("received", { message: msg });

    //save chat to the database
    // connect.then(db => {
    //   console.log("connected correctly to the server");
    //   let chatMessage = new Chat({ message: msg, sender: "Anonymous" });

    //   chatMessage.save();
    // });


//     const obj = await new Chat({ message: msg, sender: "Anonymous" }).save();

//   });
// });
}
