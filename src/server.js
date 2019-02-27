<<<<<<< HEAD
// TODO: not using this because we are using .aws credentials file; can delete this file later
const AWS = require('aws-sdk');
const express = require('express');
=======
import express from 'express';
import graphqlHTTP from 'express-graphql';
import schema from './schema';
>>>>>>> 354e3740e4e92ef37cb26074733633e98cd567e0

const expressPort = process.env.port || process.env.PORT || 4000;

const server = express();
server.use(
  '/',
  graphqlHTTP({
    schema,
    graphiql: true,
    formatError: error => ({
      message: error.message,
      stack: error.stack.split('\n'),
    }),
  }),
);

server.listen(expressPort, () => {
  console.log(`The server is running at http://localhost:${expressPort}/`);
});
