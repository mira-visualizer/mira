import * as actionTypes from '../constants/actionTypes.js';

const AWS = require('aws-sdk');
AWS.config.update({
  region:'us-east-2'
});

const ec2 = new AWS.EC2({});
const rds = new AWS.RDS({});

const params = {};

export const getEC2 = () =>{

  return (dispatch) => {
    /**
     * Data = {
    regionId: {
        VpcId: {
            AvailabilityZone: {
                EC2: {
                    id: {data}
                },
                RDS: {
                    id: {data}
                },
                S3: {
                    id: {data}
                },
                edges: {
                    inboundId: [outboundIds]
                }
            }
        }
    }
    */
    let regionState = {};
    //rds call store the result into regionState
    const promise = [];
    promise.push(new Promise(function(resolve,reject) {
      rds.describeDBInstances(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else{
          console.log("rds suuccess",data);
          
          for(let i = 0; i < data.DBInstances.length; i ++){
            let DBinstances = data.DBInstances[i];
            let {DBInstanceIdentifier, DBName, DBSubnetGroup: {VpcId}, AvailabilityZone, DbiResourceId} = DBinstances;
            //let {VpcId, Placement: {AvailabilityZone}, InstanceId} = DBinstances;
            if(!regionState.hasOwnProperty(VpcId))regionState[VpcId] = {};
            if(!regionState[VpcId].hasOwnProperty(AvailabilityZone))regionState[VpcId][AvailabilityZone] = {};
            if(!regionState[VpcId][AvailabilityZone].hasOwnProperty("RDS"))regionState[VpcId][AvailabilityZone].RDS ={};
            regionState[VpcId][AvailabilityZone].RDS[DbiResourceId] = DBinstances;        
          } 
          resolve();
        }
                    // successful response\
      })
    }))
    // get ec2 instances from API
    promise.push(new Promise(function(resolve,reject) {
      ec2.describeInstances(params, function(err, data) {
        if (err) {
          console.log("Error", err.stack);
        } else {
          console.log("Success", data.Reservations);
        }
        for(let i = 0; i < data.Reservations.length; i ++){
          let instances = data.Reservations[i].Instances;
          for( let j = 0; j < instances.length; j++){
            let {VpcId, Placement: {AvailabilityZone}, InstanceId} = instances[j];
            if(!regionState.hasOwnProperty(VpcId))regionState[VpcId] = {};
            if(!regionState[VpcId].hasOwnProperty(AvailabilityZone))regionState[VpcId][AvailabilityZone] = {};
            if(!regionState[VpcId][AvailabilityZone].hasOwnProperty("EC2"))regionState[VpcId][AvailabilityZone].EC2 = {};
            regionState[VpcId][AvailabilityZone].EC2[InstanceId] = instances[j];
          }
        }
      resolve();
      }
    )}))
    Promise.all(promise).then(function() {
      dispatch({
        type: actionTypes.GET_EC2,
        payload: JSON.stringify(regionState)
      })
    })
  }
}

export const getNodeDetails = (id) => {
  console.log('inside action creator with id:',id)
  return {
    type: actionTypes.NODE_DETAILS,
    payload: id
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

