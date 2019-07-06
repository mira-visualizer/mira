// you can delete this file

const express = require("express");
const graphqlHTTP = require("express-graphql");
const schema = require("./schema");
const expressPort = process.env.port || process.env.PORT || 4000;

const server = express();
server.use(
  "/",
  graphqlHTTP({
    schema: schema,
    graphiql: true,
    formatError: error => ({
      message: error.message,
      stack: error.stack.split("\n")
    })
  })
);

server.listen(expressPort, () => {
  console.log(`The server is running at http://localhost:${expressPort}/`);
});
