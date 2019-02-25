// GraphQL query to retrieve all region data at once

import {GraphQLSchema, GraphQLObjectType} from 'graphql';
import awsSDK from 'aws-sdk';
import { awsApiParser } from 'graphql-compose-aws';

const awsApiParser = new AwsApiParser({
  awsSDK,
})

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      // Full API:
      aws: awsApiParser.getFieldConfig(),
      // Partial API with desired services:
      // regions: awsApiParser.getService('regions').getFieldConfig(),
      // ec2: awsApiParser.getService('ec2').getFieldConfig(),
      // rds: awsApiParser.getService('rds').getFieldConfig(),
    }
  })
})

export default schema;