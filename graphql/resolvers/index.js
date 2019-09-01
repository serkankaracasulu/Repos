const Query = require("./queries/Query");
const Mutation = require("./mutations/index");
const Snap = require("./queries/Snap");
const User = require("./queries/User");
const Subscription = require("./subscriptions");
module.exports = {
  Query,
  Mutation,
  Snap,
  User,
  Subscription
};
