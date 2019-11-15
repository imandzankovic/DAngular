import * as mongoose from 'mongoose';
//var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const presentationSchema = new mongoose.Schema({
    name: {
        type: String,
        default:'New Presentation'
    },
    title: {
        type: String,
        default:'Untitled Presentation'

    },
    //slides: [SlidesSchema]
    slides: [{type: Schema.Types.ObjectId, ref: 'slide'}],
    author: { type: Schema.Types.ObjectId, ref: 'user' }
});

const Presentation = mongoose.model('Presentation', presentationSchema);

export default Presentation;
