const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userSchema = new Schema({
  username: { type: String, unique: true, required: true },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
userSchema.methods.generateAuthToken = function() {
  return jwt.sign({ username: this.username }, process.env.SECRET_KEY, {
    expiresIn: "1h"
  });
};
userSchema.pre("save", function(next) {
  if (!this.isModified("password")) return next();
  bcrypt.hash(this.password, 10).then(hash => {
    this.password = hash;
    next();
  });
});
module.exports = model("user", userSchema);
