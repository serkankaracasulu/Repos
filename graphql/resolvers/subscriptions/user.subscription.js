module.exports = {
  user: {
    subscribe: (patent, args, { pubsub }) =>
      pubsub.asyncIterator("user created")
  }
};
