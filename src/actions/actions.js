// boilerplate template - needs to be updated with more suitable actions

import * as actionTypes from '../constants/actionTypes.js';

const AWS = require('aws-sdk');
AWS.config.update({
  region:'us-east-2'
});

const ec2 = new AWS.EC2({});

const params = {};

export const getEC2 = () =>{

  return (dispatch) => {
    return ec2.describeInstances(params, function(err, data) {

      if (err) {
        console.log("Error", err.stack);
      } else {
        console.log("Success", JSON.stringify(data.Reservations));
      }
      dispatch({
        type: actionTypes.GET_EC2,
        payload: JSON.stringify(data.Reservations)
      })

    });
  }
}
// TODO set up more reducers
// export const showAllSecurityGroups = (name) => {
//   return {
//     type: actionTypes.SHOW_ALL_SECURITY_GROUPS,
//     payload: name,
//   };
// };
 

// !! for stretch features
// export const addNode = (name) => {
//   return {
//     type: actionTypes.ADD_NODE,
//     payload: name,
//   };
// };

// export const deleteNode = (name) => {
//   return {
//     type: actionTypes.DELETE_NODE,
//     payload: name,
  // };
// };

