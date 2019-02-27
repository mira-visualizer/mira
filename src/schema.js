// GraphQL query to retrieve all region data at once

import { GraphQLSchema, GraphQLObjectType } from 'graphql';
import awsSDK from 'aws-sdk';
import { AwsApiParser } from 'graphql-compose-aws';

const awsApiParser = new AwsApiParser({
  awsSDK,
});

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      // Partial API with desired services:
      ec2: awsApiParser.getService('ec2').getFieldConfig(),
      rds: awsApiParser.getService('rds').getFieldConfig(),
    },
  }),
});

export default schema;
