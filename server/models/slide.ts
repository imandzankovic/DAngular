import * as mongoose from 'mongoose';
var Schema = mongoose.Schema;

var ElementSchema = new Schema({
    id:{
        type: String
    },
    x: {
        type: Number
    },
    y: {
        type: Number
    },
    type: {
        type: String
        //default:'title'
    },
    value: {
        type: String
        //default:'value'
    }
   
    
});
var slidesSchema = new Schema({
    slide: {
        type: String
    },
    elements : [ElementSchema]
});

const Slide = mongoose.model('Slide', slidesSchema);

export default Slide;
