import React, {Component} from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/actions.js';

const AWS = require('aws-sdk');

AWS.config.update({
//   accessKeyId: "AKIAJEILNJRAXGLOWPCA",
//   secretAccessKey: "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",
  region:'us-west-2'
});

const ec2 = new AWS.EC2({apiVersion: '2016-11-15'});
const s3 = new AWS.S3();


const params = {}

class graph extends Component{
    constructor(props) {
      super(props);
  }
  componentDidMount() {

    s3.listBuckets(params, function(err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else     console.log(data);           // successful response\
    });
  };
    render() {
      return (
        <div id="graph1">
        </div>
      )
    }
  }
  
  export default graph;