import React from "react";
import { ApolloConsumer } from "@apollo/react-hooks";

const Logout = props => {
  const handleClick = client => {
    localStorage.setItem("token", "");
    console.log(client);
    client.resetStore();
  };
  return (
    <ApolloConsumer>
      {client => {
        return <button onClick={() => handleClick(client)}>Logut</button>;
      }}
    </ApolloConsumer>
  );
};

export default Logout;
