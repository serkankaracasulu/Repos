const { withFilter } = require("apollo-server-express");
module.exports = {
  snap: {
    subscribe: withFilter(
      (parent, args, { pubsub }) => pubsub.asyncIterator("snap added"),
      (payload, variables) => {
        return variables.userId
          ? String(payload.snap.userId) === variables.userId
          : true;
      }
    )
  }
};
