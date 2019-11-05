import * as mongoose from 'mongoose';

const chatSchema = new mongoose.Schema(
    {
      message: {
        type: String
      },
      sender: {
        type: String
      }
    },
    {
      timestamps: true
    }
  );

const Chat = mongoose.model('theChat', chatSchema);

export default Chat;
