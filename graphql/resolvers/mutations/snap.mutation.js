module.exports = {
  createSnap: async (parent, { data: { text, user_id } }, { Snap, pubsub }) => {
    try {
      const snap = await new Snap({
        text,
        user_id
      }).save();
      pubsub.publish("snap added", { snap });
      return snap;
    } catch (error) {
      throw Error(error);
    }
  }
};
