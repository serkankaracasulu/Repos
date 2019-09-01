import React, { useState, useRef, useContext, useEffect } from "react";
import AuthContext from "../context/auth-context";
import "./Event.css";
import Modal from "../components/Modal/Modal";
import Backdrop from "./../components/Backdrop/Backdrop";
import "./../components/Backdrop/Backdrop.css";
import EventList from "./../components/Events/EventList/EventList";
import Spinner from "../components/Spinner/Spinner";
const EventPage = () => {
  const titleEl = useRef();
  const dateEl = useRef();
  const descriptionEl = useRef();
  const priceEl = useRef();
  const [creating, setCreating] = useState(false);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const context = useContext(AuthContext);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    fecthEvent();
    return function cleanup() {
      setIsActive(false);
    };
  }, []);
  const fecthEvent = async () => {
    const requsetBody = {
      query: `
          query{
            events{
              _id
              title
              price
              description
              date
              creator{
                _id
                email
              }
            }
          }
          `
    };
    try {
      const response = await fetch("http://localhost:8000/graphql", {
        method: "POST",
        body: JSON.stringify(requsetBody),
        headers: {
          "Content-Type": "application/json"
        }
      });
      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Failed");
      }
      const returnData = await response.json();
      if (isActive) {
        setEvents(returnData.data.events);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(true);
    }
  };
  const modalConfirmedHandler = async () => {
    const title = titleEl.current.value;
    const date = dateEl.current.value;
    const description = descriptionEl.current.value;
    const price = +priceEl.current.value;
    const token = context.token;
    if (
      title.trim().legth === 0 ||
      price <= 0 ||
      date.trim().legth === 0 ||
      description.trim().legth === 0
    )
      return;

    const requsetBody = {
      query: `
          mutation{
            createEvent(eventInput:{title:"${title}",price:${price},description:"${description}",date:"${date}"}){
              _id
              title
              price
              description
              date
              creator{
                _id
                email
              }
            }
          }
          `
    };
    try {
      const response = await fetch("http://localhost:8000/graphql", {
        method: "POST",
        body: JSON.stringify(requsetBody),
        headers: {
          "Content-Type": "application/json",
          "Authorazation-x": `Bearer ${token}`
        }
      });
      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Failed");
      }
      const returnData = await response.json();
      console.log(events);
      console.log(returnData);
      const upEvent = [...events, returnData.data.createEvent];
      setEvents(upEvent);
      console.log(events);
      setCreating(!creating);
    } catch (error) {
      console.log(error);
    }
  };
  const showDetailHandler = eventId => {
    const event = events.find(e => e._id === eventId);
    setSelectedEvent(event);
  };
  const bookEventhandler = async () => {
    if (!context.token) {
      setSelectedEvent(null);
      return;
    }
    const token = context.token;
    const requsetBody = {
      query: `
      mutation {
        bookEvent(eventId: "${selectedEvent._id}") {
          _id
          createdAt
          updatedAt
        }
      }
          `
    };
    try {
      const response = await fetch("http://localhost:8000/graphql", {
        method: "POST",
        body: JSON.stringify(requsetBody),
        headers: {
          "Content-Type": "application/json",
          "Authorazation-x": `Bearer ${token}`
        }
      });
      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Failed");
      }
      const returnData = await response.json();
      console.log(returnData);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <React.Fragment>
      {creating && <Backdrop />}
      {creating && (
        <Modal
          title="Example Title"
          canCancel
          canConfirm
          onCancel={() => setCreating(!creating)}
          onConfirm={modalConfirmedHandler}
          confirmText="Confirm"
        >
          <form>
            <div className="form-control">
              <label htmlFor="title">Title</label>
              <input type="text" id="title" ref={titleEl} />
            </div>
            <div className="form-control">
              <label htmlFor="description">Description</label>
              <textarea
                type="text"
                id="description"
                rows="4"
                ref={descriptionEl}
              />
            </div>
            <div className="form-control">
              <label htmlFor="price">Price</label>
              <input type="number" id="price" ref={priceEl} />
            </div>
            <div className="form-control">
              <label htmlFor="date">Date</label>
              <input type="datetime-local" id="date" ref={dateEl} />
            </div>
          </form>
        </Modal>
      )}
      {selectedEvent && (
        <Modal
          title={selectedEvent.title}
          canCancel
          canConfirm
          onCancel={() => setSelectedEvent(null)}
          onConfirm={bookEventhandler}
          confirmText={context.token ? "Book" : "Confirm"}
        >
          <h1>{selectedEvent.title}</h1>
        </Modal>
      )}
      {context.token && (
        <div className="event-control">
          <p>Share on your event</p>
          <button className="btn" onClick={() => setCreating(!creating)}>
            Create event
          </button>
        </div>
      )}
      {isLoading ? (
        <Spinner />
      ) : (
        <EventList
          events={events}
          authUserId={context.userId}
          onViewDetail={showDetailHandler}
        />
      )}
    </React.Fragment>
  );
};

export default EventPage;
