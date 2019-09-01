const { Schema, model } = require("mongoose");
const snapSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId },
  text: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
module.exports = model("snap", snapSchema);
