import React from "react";
import "./EventItem.css";
const EvenItem = ({ event, userId, onDetail }) => {
  return (
    <li className="events__list-item">
      <h1>{event.title}</h1>
      <h2>
        {event.price} - {new Date(event.date).toLocaleDateString()}
      </h2>
      <div>
        {event.creator._id === userId ? (
          <p>Your the owner of this event</p>
        ) : (
          <button className="btn" onClick={() => onDetail(event._id)}>
            View Details
          </button>
        )}
      </div>
    </li>
  );
};

export default EvenItem;
