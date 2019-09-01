const bcrypt = require("bcrypt");
module.exports = {
  createUser: async (
    parent,
    { data: { username, password } },
    { User, pubsub }
  ) => {
    if (await User.findOne({ username }))
      throw new Error("User already exist.");

    const user = await new User({
      username,
      password
    }).save();

    pubsub.publish("user created", { user });
    return { token: user.generateAuthToken() };
  },
  signIn: async (parent, { data: { username, password } }, { User }) => {
    const user = await User.findOne({ username });
    if (!user) throw new Error("User does not exist.");
    const isValid = bcrypt.compare(password, user.password);
    if (!isValid) throw new Error("Wrong password.");
    return { token: user.generateAuthToken() };
  }
};
