const { ApolloServer } = require("apollo-server");

const typeDefs = require("./typeDefs");
const resolvers = require("./resolvers");
const mongoose = require("mongoose");
require("dotenv").config();


/* connecting the Database with the server */

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true
  })
  .then(() => console.log("DB connected! "))
  .catch(err => console.error(err))

// initiating the server
const server = new ApolloServer({
  typeDefs,
  resolvers
});


/* checking the server is working */
server.listen().then(({ url }) => {
  console.log(`server listening on ${url}`);
});
