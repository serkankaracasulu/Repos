import React from "react";
import "./EventList.css";
import EvenItem from "./Eventıtem/EventItem";
const EventList = ({ events, authUserId, onViewDetail }) => {
  return events.map(event => {
    return (
      <EvenItem
        event={event}
        userId={authUserId}
        key={event._id}
        onDetail={onViewDetail}
      />
    );
  });
};

export default EventList;
