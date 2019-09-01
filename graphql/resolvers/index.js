const bookingResolver = require("./booking");
const authResolver = require("./auth");
const eventsResolver = require("./events");

const rootResolver = {
  ...authResolver,
  ...bookingResolver,
  ...eventsResolver
};

module.exports = rootResolver;
