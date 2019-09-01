import React, { useState } from "react";
import "./App.css";
import { ApolloProvider } from "@apollo/react-hooks";
import Home from "./components/pages/Home/Home";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import Login from "./components/pages/Login";
import Join from "./components/pages/Join";
import Header from "./components/Header";
import SessionWrapperHOC from "./components/SessionWrapperHOC";
import AuthContext from "./components/Auth-Context";
import Profile from "./components/pages/Profile";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { createHttpLink } from "apollo-link-http";
import { getMainDefinition } from "apollo-utilities";
import { split } from "apollo-link";
import { ApolloLink, Observable } from "apollo-link";
import { WebSocketLink } from "apollo-link-ws";
const request = operation => {
  operation.setContext({
    headers: {
      authorization: localStorage.getItem("token") || null
    }
  });
};
const requestLink = new ApolloLink(
  (operation, forward) =>
    new Observable(observer => {
      let handle;
      operation.setContext({
        authorization: localStorage.getItem("token") || null
      });
      Promise.resolve(operation)
        .then(oper => request(oper))
        .then(() => {
          handle = forward(operation).subscribe({
            next: observer.next.bind(observer),
            error: observer.error.bind(observer),
            complete: observer.complete.bind(observer)
          });
        })
        .catch(observer.error.bind(observer));

      return () => {
        if (handle) handle.unsubscribe();
      };
    })
);
const httpLink = requestLink.concat(
  createHttpLink({
    uri: "http://localhost:4000/graphql"
  })
);

const wsLink = new WebSocketLink({
  uri: `ws://localhost:4000/graphql`,
  options: {
    reconnect: true
  }
});

const link = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);
const client3 = new ApolloClient({
  link: link,
  cache: new InMemoryCache()
});

function App() {
  const [user, setUser] = useState({});
  const [token, setToken] = useState(null);
  const setNewToken = token => {
    setToken(token);
  };
  const setNewUser = user => {
    setUser(user);
  };

  return (
    <ApolloProvider client={client3}>
      <AuthContext.Provider value={{ setNewToken, setNewUser, token, user }}>
        <SessionWrapperHOC token={token} />
        <div id="app">
          <div className="container">
            <BrowserRouter>
              <Header user={user} />
              <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/login" component={Login} />
                <Route path="/join" component={Join} />
                {user && <Route path="/profile" exact component={Profile} />}
                <Redirect to="/" />
              </Switch>
            </BrowserRouter>
          </div>
        </div>
      </AuthContext.Provider>
    </ApolloProvider>
  );
}

export default App;
