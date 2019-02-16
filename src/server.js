// TODO: not using this because we are using .aws credentials file; can delete this file later
const AWS = require('aws-sdk');

const rds = new AWS.RDS();

const params = {};

rds.describeDBInstances(params, function(err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else     console.log(data);           // successful response
});