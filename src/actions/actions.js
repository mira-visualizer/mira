import * as actionTypes from '../constants/actionTypes.js';

const AWS = require('aws-sdk');
const params = {};


export const getAWSInstancesStart = () => ({
  type: actionTypes.GET_AWS_INSTANCES_START
});

export const getAWSInstancesFinished = resp => ({
  type: actionTypes. GET_AWS_INSTANCES_FINISHED,
  payload: resp
});

export const getAWSInstancesError = err => ({
  type: actionTypes. GET_AWS_INSTANCES_ERROR,
  payload: err
});

export const getAWSInstances = (region) =>{
  AWS.config.update({
    region:region
  });
  const ec2 = new AWS.EC2({});
  const rds = new AWS.RDS({});
  return (dispatch) => {
    dispatch(getAWSInstancesStart());
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
    let sgRelationships = []; //array of arrays where each inside looks like [ [inbound sg, outbound sg] ]
    let sgNodeCorrelations = {};
    const apiPromiseArray = [];
    //adding new promise to promise array 
    apiPromiseArray.push(new Promise(function(resolve,reject) {
      const innerPromiseArray =[];
      //make an api call to get information about RDS'
      rds.describeDBInstances(params, function(err, data) {
        if (err) {
          console.log(err, err.stack)
          reject()
        } // an error occurred
        else{
          //loop through the data returned from api call
          for(let i = 0; i < data.DBInstances.length; i ++){
            let DBinstances = data.DBInstances[i];
            //destructure the data for relevant data
            let {DBSubnetGroup: {VpcId}, AvailabilityZone, DbiResourceId, VpcSecurityGroups} = DBinstances;
            // if the property doesn't exist within the object, create an object to save all the data in
            if(!regionState.hasOwnProperty(VpcId))regionState[VpcId] = {};
            if(!regionState[VpcId].hasOwnProperty(AvailabilityZone))regionState[VpcId][AvailabilityZone] = {};
            if(!regionState[VpcId][AvailabilityZone].hasOwnProperty("RDS"))regionState[VpcId][AvailabilityZone].RDS ={};
            //save the data into the regionState object
            regionState[VpcId][AvailabilityZone].RDS[DbiResourceId] = DBinstances;

            innerPromiseArray.push(new Promise(function(resolve,reject) {
              const param = {
                GroupIds:[]
              };
              for(let k = 0; k < VpcSecurityGroups.length; k++){
                param.GroupIds.push(VpcSecurityGroups[k].VpcSecurityGroupId); 
                
              }
              
              ec2.describeSecurityGroups(param, function(err, data) {
                if (err) {
                  console.log(err, err.stack);
                  reject();
                }
                else{

                  regionState[VpcId][AvailabilityZone].RDS[DbiResourceId].MySecurityGroups = data.SecurityGroups;
                  for(let h = 0; h < data.SecurityGroups.length; h++){

                    if(!sgNodeCorrelations[data.SecurityGroups[h].GroupId]) sgNodeCorrelations[data.SecurityGroups[h].GroupId]  = new Set();
                    sgNodeCorrelations[data.SecurityGroups[h].GroupId].add(DbiResourceId);

                    if(data.SecurityGroups[h].IpPermissions.length > 0){
                      for(let i = 0; i < data.SecurityGroups[h].IpPermissions[0].UserIdGroupPairs.length; i++ ){
                        sgRelationships.push([data.SecurityGroups[h].IpPermissions[0].UserIdGroupPairs[i].GroupId, data.SecurityGroups[h].GroupId])

                      }
                    }
                  }
                  // const edgeTable = createEdges();
                  // resolve(edgeTable);
                  resolve();

                }
              } )
            }))


          } 
          Promise.all(innerPromiseArray).then(function(){
            resolve();
          });
        }
      })
    }))
    // get ec2 instances from API
    apiPromiseArray.push(new Promise(function(resolve,reject) {
      const innerPromiseArray = [];
      ec2.describeInstances(params, function(err, data) {
        if (err) {
          console.log("Error", err.stack);
          reject();
        } else {
        
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
            innerPromiseArray.push(new Promise(function(resolve,reject) {
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
                else {

                  regionState[VpcId][AvailabilityZone].EC2[InstanceId].MySecurityGroups = data.SecurityGroups;
                  for(let h = 0; h < data.SecurityGroups.length; h++){
                   
                    if(!sgNodeCorrelations[data.SecurityGroups[h].GroupId]) sgNodeCorrelations[data.SecurityGroups[h].GroupId]  = new Set();
                    sgNodeCorrelations[data.SecurityGroups[h].GroupId].add(InstanceId);
                    
                    if(data.SecurityGroups[h].IpPermissions.length > 0){
                    
                      for(let i = 0; i < data.SecurityGroups[h].IpPermissions[0].UserIdGroupPairs.length; i++ ){
                        sgRelationships.push([data.SecurityGroups[h].IpPermissions[0].UserIdGroupPairs[i].GroupId, data.SecurityGroups[h].GroupId])

                      }
                    }
                  }


                  // const edgeTable = createEdges();
                  // resolve(edgeTable);
                  resolve();
                  }
              } )
            }))
          }
        }
        Promise.all(innerPromiseArray).then(function(){
          resolve();
        })
      }
      }
    )}))

  

    //once all the promise's are resolved, dispatch the data to the reducer
    Promise.all(apiPromiseArray).then(function(values) {
    let edgeTable = {};

    for(let i = 0; i < sgRelationships.length; i++){
      sgNodeCorrelations[sgRelationships[i][0]].forEach( function(val1, val2, set){
        sgNodeCorrelations[sgRelationships[i][1]].forEach( function(value1, value2, set2){
        if(!edgeTable.hasOwnProperty(val1)) edgeTable[val1]= new Set();
          edgeTable[val1].add(value1);
        })
      })
    }
      //  
      dispatch({
        type: actionTypes.GET_AWS_INSTANCES,
        payload: {
          regionState: regionState,
          currentRegion: region,
          edgeTable: edgeTable
          // sgNodeCorrelations: sgNodeCorrelations,
          // sgRelationships: sgRelationships
        } 
      })
      dispatch(getAWSInstancesFinished());
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