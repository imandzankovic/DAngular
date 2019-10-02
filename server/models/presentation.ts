import * as mongoose from 'mongoose';

const presentationSchema = new mongoose.Schema({
 presentationId:String,
 title:String
});

const Presentation = mongoose.model('Presentation', presentationSchema);

export default Presentation;
