const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const http = require("http");
const { ApolloServer, PubSub } = require("apollo-server-express");
const { importSchema } = require("graphql-import");
const User = require("./models/user");
const Snap = require("./models/snap");
const resolvers = require("./graphql/resolvers/index");
mongoose
  .connect(process.env.DB_URI, { useNewUrlParser: true, useCreateIndex: true })
  .then(() => console.log("Connected to the easy-snap database"));
const pubsub = new PubSub();
const server = new ApolloServer({
  typeDefs: importSchema("./graphql/types/schema.graphql"),
  resolvers,
  context: ({ req }) => ({
    User,
    Snap,
    activeUser: req ? req.activeUser : null,
    pubsub
  })
});
const app = express();
app.use(async (req, res, next) => {
  const token = req.headers["authorization"];
  if (token && token !== "null") {
    console.log("token ", token);
    console.log(token);
    try {
      const activeUser = await jwt.verify(token, process.env.SECRET_KEY);
      req.activeUser = activeUser;
      console.log(activeUser);
    } catch (error) {
      console.log(error);
    }
  }
  next();
});
server.applyMiddleware({ app });
const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

httpServer.listen({ port: 4000 }, () => {
  console.log(`Listening... ${server.graphqlPath}`);
});
