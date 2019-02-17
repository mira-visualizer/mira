import * as actionTypes from '../constants/actionTypes.js';

const AWS = require('aws-sdk');

const params = {};

export const getAWSInstances = (region) =>{
  AWS.config.update({
    region:region
  });
  const ec2 = new AWS.EC2({});
  const rds = new AWS.RDS({});
  return (dispatch) => {
    /** HOW WE WANT THE DATA TO IDEALLY BE FORMATTED:
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
    const apiPromiseArray = [];
    //adding new promise to promise array 
    apiPromiseArray.push(new Promise(function(resolve,reject) {
      //make an api call to get information about RDS'
      rds.describeDBInstances(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else{
          // console.log("rds suuccess",data);
          //loop through the data returned from api call
          for(let i = 0; i < data.DBInstances.length; i ++){
            let DBinstances = data.DBInstances[i];
            //destructure the data for relevant data
            let {DBInstanceIdentifier, DBName, DBSubnetGroup: {VpcId}, AvailabilityZone, DbiResourceId} = DBinstances;
            // if the property doesn't exist within the object, create an object to save all the data in
            if(!regionState.hasOwnProperty(VpcId))regionState[VpcId] = {};
            if(!regionState[VpcId].hasOwnProperty(AvailabilityZone))regionState[VpcId][AvailabilityZone] = {};
            if(!regionState[VpcId][AvailabilityZone].hasOwnProperty("RDS"))regionState[VpcId][AvailabilityZone].RDS ={};
            //save the data into the regionState object
            regionState[VpcId][AvailabilityZone].RDS[DbiResourceId] = DBinstances;        
          } 
          resolve();
        }
      })
    }))
    // get ec2 instances from API
    apiPromiseArray.push(new Promise(function(resolve,reject) {
      ec2.describeInstances(params, function(err, data) {
        if (err) {
          console.log("Error", err.stack);
          reject();
        } else {
          console.log("Success", data.Reservations);
        }
        //data is formatted differently from RDS, needs an extra layer of iteration
        for(let i = 0; i < data.Reservations.length; i ++){
          let instances = data.Reservations[i].Instances;
          for( let j = 0; j < instances.length; j++){
            let {VpcId, Placement: {AvailabilityZone}, InstanceId, SecurityGroups} = instances[j];
            if(!regionState.hasOwnProperty(VpcId))regionState[VpcId] = {};
            if(!regionState[VpcId].hasOwnProperty(AvailabilityZone))regionState[VpcId][AvailabilityZone] = {};
            if(!regionState[VpcId][AvailabilityZone].hasOwnProperty("EC2"))regionState[VpcId][AvailabilityZone].EC2 = {};
            regionState[VpcId][AvailabilityZone].EC2[InstanceId] = instances[j];

            //making a new promise to query for information about security group related to each EC2
            apiPromiseArray.push(new Promise(function(resolve,reject) {
              const param = {
                GroupIds:[]
              };
              for(let k = 0; k < SecurityGroups.length; k++){
                param.GroupIds.push(SecurityGroups[k].GroupId); 
                
              }
              ec2.describeSecurityGroups(param, function(err, data) {
                if (err) {
                  console.log(err, err.stack);
                  reject();
                }
                else console.log(data);
                resolve();
              } )
            }))
          }
        }
      resolve();
      }
    )}))

    //once all the promise's are resolved, dispatch the data to the reducer
    Promise.all(apiPromiseArray).then(function() {
      dispatch({
        type: actionTypes.GET_AWS_INSTANCES,
        payload: {
          regionState: JSON.stringify(regionState),
          currentRegion: region
        } 
      })
    })
  }
}

//takes in an ID from cyto and dispatches the active id to the reducer to save in state
export const getNodeDetails = (data) => {
  return {
    type: actionTypes.NODE_DETAILS,
    payload: data
  }
}