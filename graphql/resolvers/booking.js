const Booking = require("../../models/booking");
const Event = require("../../models/event");
const { transformBooking } = require("./merge");

module.exports = {
  bookings: async () => {
    try {
      const bookings = await Booking.find({});
      return bookings.map(booking => {
        return transformBooking(booking);
      });
    } catch (error) {
      throw error;
    }
  },
  bookEvent: async (args, req) => {
    if (!req.isAuth) throw new Error("Unauthanticated!");
    const fetchedEvent = await Event.findOne({ _id: args.eventId });
    const booking = new Booking({
      user: req.userId,
      event: fetchedEvent
    });
    try {
      await booking.save();
      return transformBooking(booking);
    } catch (error) {
      throw error;
    }
  },
  cancelBooking: async args => {
    try {
      const booking = Booking.findById(args.bookingId).populate("event");
      const event = releaseEvents(booking.event);
      await Booking.deleteOne({ _id: args.bookingId });
      return event;
    } catch (error) {
      throw error;
    }
  }
};
