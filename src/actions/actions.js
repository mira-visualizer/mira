import * as actionTypes from '../constants/actionTypes.js';
import axios from 'axios';
import compileGraphData from '../assets/compileGraphData'

const AWS = require('aws-sdk');

const params = {};


export const getAWSInstancesStart = () => ({
  type: actionTypes.GET_AWS_INSTANCES_START,
});

export const getAWSInstancesFinished = resp => ({
  type: actionTypes.GET_AWS_INSTANCES_FINISHED,
  payload: resp,
});

export const getAWSInstancesError = err => ({
  type: actionTypes.GET_AWS_INSTANCES_ERROR,
  payload: err,
});

export const getAWSInstances = (region) => {
  AWS.config.update({
    region,
  });
  console.log("THE AWS INSTANCE CONFIG IS ", AWS.config);
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
    const regionState = {};
    const sgRelationships = []; // array of arrays where each inside looks like [ [inbound sg, outbound sg] ]
    const sgNodeCorrelations = {};
    const apiPromiseArray = [];
    // adding new promise to promise array
    apiPromiseArray.push(new Promise(((resolve, reject) => {
      const innerPromiseArray = [];
      // make an api call to get information about RDS'
      rds.describeDBInstances(params, (err, data) => {
        if (err) {
          console.log(err, err.stack);
          reject();
        } // an error occurred
        else {
          // loop through the data returned from api call
          for (let i = 0; i < data.DBInstances.length; i++) {
            const DBinstances = data.DBInstances[i];
            // destructure the data for relevant data
            const {
              DBSubnetGroup: { VpcId }, AvailabilityZone, DbiResourceId, VpcSecurityGroups,
            } = DBinstances;
            // if the property doesn't exist within the object, create an object to save all the data in
            if (!regionState.hasOwnProperty(VpcId))regionState[VpcId] = {};
            if (!regionState[VpcId].hasOwnProperty(AvailabilityZone))regionState[VpcId][AvailabilityZone] = {};
            if (!regionState[VpcId][AvailabilityZone].hasOwnProperty('RDS'))regionState[VpcId][AvailabilityZone].RDS = {};
            // save the data into the regionState object
            regionState[VpcId][AvailabilityZone].RDS[DbiResourceId] = DBinstances;

            innerPromiseArray.push(new Promise(((resolve, reject) => {
              const param = {
                GroupIds: [],
              };
              for (let k = 0; k < VpcSecurityGroups.length; k++) {
                param.GroupIds.push(VpcSecurityGroups[k].VpcSecurityGroupId);
              }

              ec2.describeSecurityGroups(param, (err, data) => {
                if (err) {
                  console.log(err, err.stack);
                  reject();
                } else {
                  regionState[VpcId][AvailabilityZone].RDS[DbiResourceId].MySecurityGroups = data.SecurityGroups;
                  for (let h = 0; h < data.SecurityGroups.length; h++) {
                    if (!sgNodeCorrelations[data.SecurityGroups[h].GroupId]) sgNodeCorrelations[data.SecurityGroups[h].GroupId] = new Set();
                    sgNodeCorrelations[data.SecurityGroups[h].GroupId].add(DbiResourceId);
                    if (data.SecurityGroups[h].IpPermissions.length > 0) {
                      for (let i = 0; i < data.SecurityGroups[h].IpPermissions[0].UserIdGroupPairs.length; i++) {
                        sgRelationships.push([data.SecurityGroups[h].IpPermissions[0].UserIdGroupPairs[i].GroupId, data.SecurityGroups[h].GroupId]);
                      }
                    }
                  }
                  // const edgeTable = createEdges();
                  // resolve(edgeTable);
                  resolve();
                }
              });
            })));
          }
          Promise.all(innerPromiseArray).then(() => {
            resolve();
          });
        }
      });
    })));
    // get ec2 instances from API
    apiPromiseArray.push(new Promise(((resolve, reject) => {
      const innerPromiseArray = [];
      ec2.describeInstances(params, (err, data) => {
        if (err) {
          console.log('Error', err.stack);
          reject();
        } else {
          console.log('EC2 data from SDK', data);
          // data is formatted differently from RDS, needs an extra layer of iteration
          for (let i = 0; i < data.Reservations.length; i++) {
            const instances = data.Reservations[i].Instances;
            for (let j = 0; j < instances.length; j++) {
              const {
                VpcId, Placement: { AvailabilityZone }, InstanceId, SecurityGroups,
              } = instances[j];
              if (!regionState.hasOwnProperty(VpcId))regionState[VpcId] = {};
              if (!regionState[VpcId].hasOwnProperty(AvailabilityZone))regionState[VpcId][AvailabilityZone] = {};
              if (!regionState[VpcId][AvailabilityZone].hasOwnProperty('EC2'))regionState[VpcId][AvailabilityZone].EC2 = {};
              regionState[VpcId][AvailabilityZone].EC2[InstanceId] = instances[j];
              // making a new promise to query for information about security group related to each EC2
              innerPromiseArray.push(new Promise(((resolve, reject) => {
                const param = {
                  GroupIds: [],
                };
                for (let k = 0; k < SecurityGroups.length; k++) {
                  param.GroupIds.push(SecurityGroups[k].GroupId);
                }
                ec2.describeSecurityGroups(param, (err, data) => {
                  if (err) {
                    console.log(err, err.stack);
                    reject();
                  } else {
                    regionState[VpcId][AvailabilityZone].EC2[InstanceId].MySecurityGroups = data.SecurityGroups;
                    for (let h = 0; h < data.SecurityGroups.length; h++) {
                      if (!sgNodeCorrelations[data.SecurityGroups[h].GroupId]) sgNodeCorrelations[data.SecurityGroups[h].GroupId] = new Set();
                      sgNodeCorrelations[data.SecurityGroups[h].GroupId].add(InstanceId);
                      if (data.SecurityGroups[h].IpPermissions.length > 0) {
                        for (let i = 0; i < data.SecurityGroups[h].IpPermissions[0].UserIdGroupPairs.length; i++) {
                          sgRelationships.push([data.SecurityGroups[h].IpPermissions[0].UserIdGroupPairs[i].GroupId, data.SecurityGroups[h].GroupId]);
                        }
                      }
                    }


                    // const edgeTable = createEdges();
                    // resolve(edgeTable);
                    resolve();
                  }
                });
              })));
            }
          }
          Promise.all(innerPromiseArray).then(() => {
            resolve();
          });
        }
      });
    })));


    // once all the promise's are resolved, dispatch the data to the reducer
    Promise.all(apiPromiseArray).then((values) => {
      const edgeTable = {};

      for (let i = 0; i < sgRelationships.length; i++) {
        sgNodeCorrelations[sgRelationships[i][0]].forEach((val1, val2, set) => {
          sgNodeCorrelations[sgRelationships[i][1]].forEach((value1, value2, set2) => {
            if (!edgeTable.hasOwnProperty(val1)) edgeTable[val1] = new Set();
            edgeTable[val1].add(value1);
          });
        });
      }
      //
      dispatch({
        type: actionTypes.GET_AWS_INSTANCES,
        payload: {
          regionState,
          currentRegion: region,
          edgeTable,
          // sgNodeCorrelations: sgNodeCorrelations,
          // sgRelationships: sgRelationships
        },
      });
      dispatch(getAWSInstancesFinished());
    });
  };
};

// takes in an ID from cyto and dispatches the active id to the reducer to save in state
export const getNodeDetails = data => ({
  type: actionTypes.NODE_DETAILS,
  payload: data,
});

export const getAllRegions = () => {
  return(dispatch) => {
    axios({
      method: 'post',
      url: 'https://graphql-compose.herokuapp.com/aws/',
      data: {
        query: `
        query {
          aws(config: {
            accessKeyId: " -- ENTER ACCESS KEY ID -- ",
            secretAccessKey: " -- ENTER SECRET ACCESS KEY -- "
          }) {
            us_east_2_ec2: ec2(config:{
              region: "us-east-2"
            }) {
              describeInstances {
                Reservations {
                  Instances {
                    VpcId
                    Placement {
                      AvailabilityZone
                    }
                    InstanceId
                    SecurityGroups {
                      GroupId
                    }
                  }
                }
              }
            }
            usEast1_ec2: ec2(config:{
              region: "us-east-1"
            }) {
              describeInstances {
                Reservations {
                  Instances {
                    VpcId
                    Placement {
                      AvailabilityZone
                    }
                    InstanceId
                    SecurityGroups {
                      GroupId
                    }
                  }
                }
              }
            } 
            usWest1_ec2: ec2(config:{
              region: "us-west-1"
            }) {
              describeInstances {
                Reservations {
                  Instances {
                    VpcId
                    Placement {
                      AvailabilityZone
                    }
                    InstanceId
                    SecurityGroups {
                      GroupId
                    }
                  }
                }
              }
            }
            usWest2_ec2: ec2(config:{
              region: "us-west-2"
            }) {
              describeInstances {
                Reservations {
                  Instances {
                    VpcId
                    Placement {
                      AvailabilityZone
                    }
                    InstanceId
                    SecurityGroups {
                      GroupId
                    }
                  }
                }
              }
            }
            apSouth1_ec2: ec2(config:{
              region: "ap-south-1"
            }) {
              describeInstances {
                Reservations {
                  Instances {
                    InstanceId
                  }
                }
              }
            }
            apNortheast2_ec2: ec2(config:{
              region: "ap-northeast-2"
            }) {
              describeInstances {
                Reservations {
                  Instances {
                    VpcId
                    Placement {
                      AvailabilityZone
                    }
                    InstanceId
                    SecurityGroups {
                      GroupId
                    }
                  }
                }
              }
            }
            apSoutheast1_ec2: ec2(config:{
              region: "ap-southeast-1"
            }) {
              describeInstances {
                Reservations {
                  Instances {
                    InstanceId
                  }
                }
              }
            }
            apSoutheast2_ec2: ec2(config:{
              region: "ap-southeast-2"
            }) {
              describeInstances {
                Reservations {
                  Instances {
                    VpcId
                    Placement {
                      AvailabilityZone
                    }
                    InstanceId
                    SecurityGroups {
                      GroupId
                    }
                  }
                }
              }
            }
            apNortheast1_ec2: ec2(config:{
              region: "ap-northeast-1"
            }) {
              describeInstances {
                Reservations {
                  Instances {
                    VpcId
                    Placement {
                      AvailabilityZone
                    }
                    InstanceId
                    SecurityGroups {
                      GroupId
                    }
                  }
                }
              }
            }
            caCentral1_ec2: ec2(config:{
              region: "ca-central-1"
            }) {
              describeInstances {
                Reservations {
                  Instances {
                    InstanceId
                  }
                }
              }
            }
            euCentral1_ec2: ec2(config:{
              region: "eu-central-1"
            }) {
              describeInstances {
                Reservations {
                  Instances {
                    VpcId
                    Placement {
                      AvailabilityZone
                    }
                    InstanceId
                    SecurityGroups {
                      GroupId
                    }
                  }
                }
              }
            }
            euWest1_ec2: ec2(config:{
              region: "eu-west-1"
            }) {
              describeInstances {
                Reservations {
                  Instances {
                    VpcId
                    Placement {
                      AvailabilityZone
                    }
                    InstanceId
                    SecurityGroups {
                      GroupId
                    }
                  }
                }
              }
            }
            euWest2_ec2: ec2(config:{
              region: "eu-west-2"
            }) {
              describeInstances {
                Reservations {
                  Instances {
                    VpcId
                    Placement {
                      AvailabilityZone
                    }
                    InstanceId
                    SecurityGroups {
                      GroupId
                    }
                  }
                }
              }
            }
            euWest3_ec2: ec2(config:{
              region: "eu-west-3"
            }) {
              describeInstances {
                Reservations {
                  Instances {
                    VpcId
                    Placement {
                      AvailabilityZone
                    }
                    InstanceId
                    SecurityGroups {
                      GroupId
                    }
                  }
                }
              }
            }
            euNorth1_ec2: ec2(config:{
              region: "eu-north-1"
            }) {
              describeInstances {
                Reservations {
                  Instances {
                    VpcId
                    Placement {
                      AvailabilityZone
                    }
                    InstanceId
                    SecurityGroups {
                      GroupId
                    }
                  }
                }
              }
            }
            saEast1_ec2: ec2(config:{
              region: "sa-east-1"
            }) {
              describeInstances {
                Reservations {
                  Instances {
                    VpcId
                    Placement {
                      AvailabilityZone
                    }
                    InstanceId
                    SecurityGroups {
                      GroupId
                    }
                  }
                }
              }
            }
            
            
            
            
            usEast2_rds: rds(config:{
              region: "us-east-2"
            }) {
              describeDBInstances {
                DBInstances {
                  DBSubnetGroup {
                    VpcId
                  }
                  AvailabilityZone
                  DbiResourceId
                  VpcSecurityGroups {
                    VpcSecurityGroupId
                  }
                }
              }
            }
            usEast1_rds: rds(config:{
              region: "us-east-1"
            }) {
              describeDBInstances {
                DBInstances {
                  DBSubnetGroup {
                    VpcId
                  }
                  AvailabilityZone
                  DbiResourceId
                  VpcSecurityGroups {
                    VpcSecurityGroupId
                  }
                }
              }
            }
            usWest1_rds: rds(config:{
              region: "us-west-1"
            }) {
              describeDBInstances {
                DBInstances {
                  DBSubnetGroup {
                    VpcId
                  }
                  AvailabilityZone
                  DbiResourceId
                  VpcSecurityGroups {
                    VpcSecurityGroupId
                  }
                }
              }
            }
            usWest2_rds: rds(config:{
              region: "us-west-2"
            }) {
              describeDBInstances {
                DBInstances {
                  DBSubnetGroup {
                    VpcId
                  }
                  AvailabilityZone
                  DbiResourceId
                  VpcSecurityGroups {
                    VpcSecurityGroupId
                  }
                }
              }
            }
            apSouth1_rds: rds(config:{
              region: "ap-south-1"
            }) {
              describeDBInstances {
                DBInstances {
                  DBSubnetGroup {
                    VpcId
                  }
                  AvailabilityZone
                  DbiResourceId
                  VpcSecurityGroups {
                    VpcSecurityGroupId
                  }
                }
              }
            }
            apNortheast2_rds: rds(config:{
              region: "ap-northeast-2"
            }) {
              describeDBInstances {
                DBInstances {
                  DBSubnetGroup {
                    VpcId
                  }
                  AvailabilityZone
                  DbiResourceId
                  VpcSecurityGroups {
                    VpcSecurityGroupId
                  }
                }
              }
            }
            apSoutheast1_rds: rds(config:{
              region: "ap-southeast-1"
            }) {
              describeDBInstances {
                DBInstances {
                  DBSubnetGroup {
                    VpcId
                  }
                  AvailabilityZone
                  DbiResourceId
                  VpcSecurityGroups {
                    VpcSecurityGroupId
                  }
                }
              }
            }
            apSoutheast2_rds: rds(config:{
              region: "ap-southeast-2"
            }) {
              describeDBInstances {
                DBInstances {
                  DBSubnetGroup {
                    VpcId
                  }
                  AvailabilityZone
                  DbiResourceId
                  VpcSecurityGroups {
                    VpcSecurityGroupId
                  }
                }
              }
            }
            apNortheast1_rds: rds(config:{
              region: "ap-northeast-1"
            }) {
              describeDBInstances {
                DBInstances {
                  DBSubnetGroup {
                    VpcId
                  }
                  AvailabilityZone
                  DbiResourceId
                  VpcSecurityGroups {
                    VpcSecurityGroupId
                  }
                }
              }
            }
            caCentral1_rds: rds(config:{
              region: "ca-central-1"
            }) {
              describeDBInstances {
                DBInstances {
                  DBSubnetGroup {
                    VpcId
                  }
                  AvailabilityZone
                  DbiResourceId
                  VpcSecurityGroups {
                    VpcSecurityGroupId
                  }
                }
              }
            }
            euCentral1_rds: rds(config:{
              region: "eu-central-1"
            }) {
              describeDBInstances {
                DBInstances {
                  DBSubnetGroup {
                    VpcId
                  }
                  AvailabilityZone
                  DbiResourceId
                  VpcSecurityGroups {
                    VpcSecurityGroupId
                  }
                }
              }
            }
            euWest1_rds: rds(config:{
              region: "eu-west-1"
            }) {
              describeDBInstances {
                DBInstances {
                  DBSubnetGroup {
                    VpcId
                  }
                  AvailabilityZone
                  DbiResourceId
                  VpcSecurityGroups {
                    VpcSecurityGroupId
                  }
                }
              }
            }
            euWest2_rds: rds(config:{
              region: "eu-west-2"
            }) {
              describeDBInstances {
                DBInstances {
                  DBSubnetGroup {
                    VpcId
                  }
                  AvailabilityZone
                  DbiResourceId
                  VpcSecurityGroups {
                    VpcSecurityGroupId
                  }
                }
              }
            }
            euWest3_rds: rds(config:{
              region: "eu-west-3"
            }) {
              describeDBInstances {
                DBInstances {
                  DBSubnetGroup {
                    VpcId
                  }
                  AvailabilityZone
                  DbiResourceId
                  VpcSecurityGroups {
                    VpcSecurityGroupId
                  }
                }
              }
            }
            euNorth1_rds: rds(config:{
              region: "eu-north-1"
            }) {
              describeDBInstances {
                DBInstances {
                  DBSubnetGroup {
                    VpcId
                  }
                  AvailabilityZone
                  DbiResourceId
                  VpcSecurityGroups {
                    VpcSecurityGroupId
                  }
                }
              }
            }
            saEast1_rds: rds(config:{
              region: "sa-east-1"
            }) {
              describeDBInstances {
                DBInstances {
                  DBSubnetGroup {
                    VpcId
                  }
                  AvailabilityZone
                  DbiResourceId
                  VpcSecurityGroups {
                    VpcSecurityGroupId
                  }
                }
              }
            }
          }
        }
        `
      }
    }).then((result) => {
      console.log('This is the result: ', result);
      const aws = result.data.data.aws;
      let graphData = new compileGraphData();
      for (let regions in aws) {
        const regionArray = regions.split("_")
        const regionString = regionArray[0] + "-" + regionArray[1] + "-" + regionArray[2];
        if (regionArray[3] === "ec2") {
          console.log("the region string is ", regionString);
          graphData.compileEC2Data(aws[regions].describeInstances, regionString);
        }
      }
      console.log('Heres the graph data for regions: ', graphData.getRegionData())
      dispatch({
        type: actionTypes.GET_ALL_REGIONS,
        payload: {
          result,
        },
      });
    })
  }
}
