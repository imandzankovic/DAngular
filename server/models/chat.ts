import * as mongoose from 'mongoose';
var Schema = mongoose.Schema;

const chatSchema = new mongoose.Schema(
    {
      answer: {
        type: String
      },
      sender: {
        type: String
      },
      slide:
       {type: Schema.Types.ObjectId, ref: 'Slide'}
    
    },
    {
      timestamps: true
    }
  );

const Chat = mongoose.model('theChat', chatSchema);

export default Chat;
