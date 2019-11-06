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
      const obj = await new Chat(req.body).save();
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
      console.log(req)
      res.setHeader("Content-Type", "application/json");
      res.statusCode  =  200;
      const docs = await this.model.find({})
      .populate('Slide')
      .exec();
      console.log(docs)
      res.json(docs);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }
  delete = async (req, res) => {
    try {
      await this.model.findOneAndRemove({ _id: req.params.id });
      res.sendStatus(200);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  
}
