import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../context/auth-context";
import Spinner from "../components/Spinner/Spinner";
const BookingPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const context = useContext(AuthContext);
  const token = context.token;

  useEffect(() => {
    fetchBooking();
  }, []);

  const fetchBooking = async () => {
    setIsLoading(true);
    const requsetBody = {
      query: `
          query{
            bookings{
              _id
              createdAt
              event{
                _id
                title
                date
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
      setBookings(returnData.data.bookings);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(true);
    }
  };

  return isLoading ? (
    <Spinner />
  ) : (
    <ul>
      {bookings.map(book => {
        return <li key={book._id}>{book.event.title} </li>;
      })}
    </ul>
  );
};

export default BookingPage;
