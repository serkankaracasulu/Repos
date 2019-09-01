const Event = require("../../models/event");
const User = require("../../models/user");
const DataLoader = require("dataloader");

const eventLoader = new DataLoader(keys => {
  return events(keys);
});
const userLoader = new DataLoader(keys => {
  return User.find({ _id: { $in: keys } });
});

function transformBooking(booking) {
  return {
    ...booking._doc,
    user: () => user(booking._doc.user),
    event: () => singleEvent(booking._doc.event)
  };
}
async function events(eventIds) {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });
    return events.map(event => {
      return transformEvent(event);
    });
  } catch (err) {
    throw err;
  }
}
async function user(id) {
  try {
    const user = await userLoader.load(id.toString());
    return {
      ...user._doc,
      createdEvents: () => eventLoader.loadMany(user._doc.createdEvents)
    };
  } catch (err) {
    throw new Error(err);
  }
}
async function singleEvent(id) {
  try {
    return await eventLoader.load(id.toString());
  } catch (error) {
    throw error;
  }
}
function transformEvent(event) {
  return {
    ...event._doc,
    date: new Date(event.date).toISOString(),
    creator: () => user(event._doc.creator)
  };
}

module.exports = {
  transformEvent,
  transformBooking
};
