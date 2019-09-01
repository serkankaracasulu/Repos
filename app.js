const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const graphqlhttp = require("express-graphql");
const graphQlSchema = require("./graphql/schema/index");
const graphQlResolver = require("./graphql/resolvers/index");
const isAuth = require("./middleware/is-auth");
const app = express();
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorazation-x");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});
app.use(isAuth);
app.use(
  "/graphql",
  graphqlhttp({
    schema: graphQlSchema,
    rootValue: graphQlResolver,
    graphiql: true
  })
);
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${
      process.env.MONGO_PASSWORD
    }@cluster0-qfhur.mongodb.net/${
      process.env.MONGO_DB
    }?retryWrites=true&w=majority`,
    { useNewUrlParser: true }
  )
  .then(() => {
    app.listen(8000);
    console.log("Connected to Database");
  })
  .catch(err => console.log(err));
