import * as actionTypes from "../constants/actionTypes.js";
import axios from "axios";
import compileGraphData from "../assets/compileGraphData";

const AWS = require("aws-sdk");
const params = {};

export const getAWSKeys = keys => ({
  type: actionTypes.GET_AWS_KEYS,
  payload: keys
});

export const getAWSInstancesStart = () => ({
  type: actionTypes.GET_AWS_INSTANCES_START
});

export const getAWSInstancesFinished = resp => ({
  type: actionTypes.GET_AWS_INSTANCES_FINISHED,
  payload: resp
});

export const getAWSInstancesError = err => ({
  type: actionTypes.GET_AWS_INSTANCES_ERROR,
  payload: err
});

export const getAWSInstances = region => {
  // tell them which region they want
  AWS.config.update({
    region
  });
  // need create new instances for whatever we're querying for
  const ec2 = new AWS.EC2({});
  const rds = new AWS.RDS({});
  return dispatch => {
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
    apiPromiseArray.push(
      new Promise((resolve, reject) => {
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
                DBSubnetGroup: { VpcId },
                AvailabilityZone,
                DbiResourceId,
                VpcSecurityGroups
              } = DBinstances;
              // if the property doesn't exist within the object, create an object to save all the data in
              if (!regionState.hasOwnProperty(VpcId)) regionState[VpcId] = {};
              if (!regionState[VpcId].hasOwnProperty(AvailabilityZone))
                regionState[VpcId][AvailabilityZone] = {};
              if (!regionState[VpcId][AvailabilityZone].hasOwnProperty("RDS"))
                regionState[VpcId][AvailabilityZone].RDS = {};
              // save the data into the regionState object
              regionState[VpcId][AvailabilityZone].RDS[
                DbiResourceId
              ] = DBinstances;
              innerPromiseArray.push(
                new Promise((resolve, reject) => {
                  const param = {
                    GroupIds: []
                  };
                  for (let k = 0; k < VpcSecurityGroups.length; k++) {
                    param.GroupIds.push(
                      VpcSecurityGroups[k].VpcSecurityGroupId
                    );
                  }
                  ec2.describeSecurityGroups(param, (err, data) => {
                    if (err) {
                      console.log(err, err.stack);
                      reject();
                    } else {
                      regionState[VpcId][AvailabilityZone].RDS[
                        DbiResourceId
                      ].MySecurityGroups = data.SecurityGroups;
                      for (let h = 0; h < data.SecurityGroups.length; h++) {
                        if (!sgNodeCorrelations[data.SecurityGroups[h].GroupId])
                          sgNodeCorrelations[
                            data.SecurityGroups[h].GroupId
                          ] = new Set();
                        sgNodeCorrelations[data.SecurityGroups[h].GroupId].add(
                          DbiResourceId
                        );
                        if (data.SecurityGroups[h].IpPermissions.length > 0) {
                          for (
                            let i = 0;
                            i <
                            data.SecurityGroups[h].IpPermissions[0]
                              .UserIdGroupPairs.length;
                            i++
                          ) {
                            sgRelationships.push([
                              data.SecurityGroups[h].IpPermissions[0]
                                .UserIdGroupPairs[i].GroupId,
                              data.SecurityGroups[h].GroupId
                            ]);
                          }
                        }
                      }
                      // const edgeTable = createEdges();
                      // resolve(edgeTable);
                      resolve();
                    }
                  });
                })
              );
            }
            Promise.all(innerPromiseArray).then(() => {
              resolve();
            });
          }
        });
      })
    );
    // get ec2 instances from API
    apiPromiseArray.push(
      new Promise((resolve, reject) => {
        const innerPromiseArray = [];
        ec2.describeInstances(params, (err, data) => {
          if (err) {
            console.log("Error", err.stack);
            reject();
          } else {
            console.log("EC2 data from SDK", data);
            // data is formatted differently from RDS, needs an extra layer of iteration
            for (let i = 0; i < data.Reservations.length; i++) {
              const instances = data.Reservations[i].Instances;
              for (let j = 0; j < instances.length; j++) {
                const {
                  VpcId,
                  Placement: { AvailabilityZone },
                  InstanceId,
                  SecurityGroups
                } = instances[j];
                if (!regionState.hasOwnProperty(VpcId)) regionState[VpcId] = {};
                if (!regionState[VpcId].hasOwnProperty(AvailabilityZone))
                  regionState[VpcId][AvailabilityZone] = {};
                if (!regionState[VpcId][AvailabilityZone].hasOwnProperty("EC2"))
                  regionState[VpcId][AvailabilityZone].EC2 = {};
                regionState[VpcId][AvailabilityZone].EC2[InstanceId] =
                  instances[j];
                // making a new promise to query for information about security group related to each EC2
                innerPromiseArray.push(
                  new Promise((resolve, reject) => {
                    const param = {
                      GroupIds: []
                    };
                    for (let k = 0; k < SecurityGroups.length; k++) {
                      param.GroupIds.push(SecurityGroups[k].GroupId);
                    }
                    ec2.describeSecurityGroups(param, (err, data) => {
                      if (err) {
                        console.log(err, err.stack);
                        reject();
                      } else {
                        regionState[VpcId][AvailabilityZone].EC2[
                          InstanceId
                        ].MySecurityGroups = data.SecurityGroups;
                        for (let h = 0; h < data.SecurityGroups.length; h++) {
                          if (
                            !sgNodeCorrelations[data.SecurityGroups[h].GroupId]
                          )
                            sgNodeCorrelations[
                              data.SecurityGroups[h].GroupId
                            ] = new Set();
                          sgNodeCorrelations[
                            data.SecurityGroups[h].GroupId
                          ].add(InstanceId);
                          if (data.SecurityGroups[h].IpPermissions.length > 0) {
                            for (
                              let i = 0;
                              i <
                              data.SecurityGroups[h].IpPermissions[0]
                                .UserIdGroupPairs.length;
                              i++
                            ) {
                              sgRelationships.push([
                                data.SecurityGroups[h].IpPermissions[0]
                                  .UserIdGroupPairs[i].GroupId,
                                data.SecurityGroups[h].GroupId
                              ]);
                            }
                          }
                        }
                        // const edgeTable = createEdges();
                        // resolve(edgeTable);
                        resolve();
                      }
                    });
                  })
                );
              }
            }
            Promise.all(innerPromiseArray).then(() => {
              resolve();
            });
          }
        });
      })
    );
    // once all the promise's are resolved, dispatch the data to the reducer
    Promise.all(apiPromiseArray).then(values => {
      const edgeTable = {};
      for (let i = 0; i < sgRelationships.length; i++) {
        sgNodeCorrelations[sgRelationships[i][0]].forEach((val1, val2, set) => {
          sgNodeCorrelations[sgRelationships[i][1]].forEach(
            (value1, value2, set2) => {
              if (!edgeTable.hasOwnProperty(val1)) edgeTable[val1] = new Set();
              edgeTable[val1].add(value1);
            }
          );
        });
      }
      //
      dispatch({
        type: actionTypes.GET_AWS_INSTANCES,
        payload: {
          regionState,
          currentRegion: region,
          edgeTable
          // sgNodeCorrelations: sgNodeCorrelations,
          // sgRelationships: sgRelationships
        }
      });
      dispatch(getAWSInstancesFinished());
    });
  };
};

// takes in an ID from cyto and dispatches the active id to the reducer to save in state
export const getNodeDetails = data => ({
  type: actionTypes.NODE_DETAILS,
  payload: data
});

export const getAllRegions = (publicKey, privateKey) => {
  return dispatch => {
    dispatch(getAWSInstancesStart());
    axios({
      method: "post",
      url: "https://graphql-compose.herokuapp.com/aws/",
      data: {
        query: `
        query {
          aws(config: {
            accessKeyId: "${publicKey}",
            secretAccessKey: "${privateKey}"
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
                    State {
                      Name
                    }
                    InstanceId
                    SecurityGroups {
                      GroupId
                    }
                  }
                }
              }
            }
            us_east_1_ec2: ec2(config:{
              region: "us-east-1"
            }) {
              describeInstances {
                Reservations {
                  Instances {
                    VpcId
                    Placement {
                      AvailabilityZone
                    }
                    State {
                      Name
                    }
                    InstanceId
                    SecurityGroups {
                      GroupId
                    }
                  }
                }
              }
            } 
            us_west_1_ec2: ec2(config:{
              region: "us-west-1"
            }) {
              describeInstances {
                Reservations {
                  Instances {
                    VpcId
                    Placement {
                      AvailabilityZone
                    }
                    State {
                      Name
                    }
                    InstanceId
                    SecurityGroups {
                      GroupId
                    }
                  }
                }
              }
            }
            us_west_2_ec2: ec2(config:{
              region: "us-west-2"
            }) {
              describeInstances {
                Reservations {
                  Instances {
                    VpcId
                    Placement {
                      AvailabilityZone
                    }
                    State {
                      Name
                    }
                    InstanceId
                    SecurityGroups {
                      GroupId
                    }
                  }
                }
              }
            }
            ap_south_1_ec2: ec2(config:{
              region: "ap-south-1"
            }) {
              describeInstances {
                Reservations {
                  Instances {
                    VpcId
                    Placement {
                      AvailabilityZone
                    }
                    State {
                      Name
                    }
                    InstanceId
                    SecurityGroups {
                      GroupId
                    }
                  }
                }
              }
            }
            ap_northeast_2_ec2: ec2(config:{
              region: "ap-northeast-2"
            }) {
              describeInstances {
                Reservations {
                  Instances {
                    VpcId
                    Placement {
                      AvailabilityZone
                    }
                    State {
                      Name
                    }
                    InstanceId
                    SecurityGroups {
                      GroupId
                    }
                  }
                }
              }
            }
            ap_southeast_1_ec2: ec2(config:{
              region: "ap-southeast-1"
            }) {
              describeInstances {
                Reservations {
                  Instances {
                    VpcId
                    Placement {
                      AvailabilityZone
                    }
                    State {
                      Name
                    }
                    InstanceId
                    SecurityGroups {
                      GroupId
                    }
                  }
                }
              }
            }
            ap_southeast_2_ec2: ec2(config:{
              region: "ap-southeast-2"
            }) {
              describeInstances {
                Reservations {
                  Instances {
                    VpcId
                    Placement {
                      AvailabilityZone
                    }
                    State {
                      Name
                    }
                    InstanceId
                    SecurityGroups {
                      GroupId
                    }
                  }
                }
              }
            }
            ap_northeast_1_ec2: ec2(config:{
              region: "ap-northeast-1"
            }) {
              describeInstances {
                Reservations {
                  Instances {
                    VpcId
                    Placement {
                      AvailabilityZone
                    }
                    State {
                      Name
                    }
                    InstanceId
                    SecurityGroups {
                      GroupId
                    }
                  }
                }
              }
            }
            ca_central_1_ec2: ec2(config:{
              region: "ca-central-1"
            }) {
              describeInstances {
                Reservations {
                  Instances {
                    VpcId
                    Placement {
                      AvailabilityZone
                    }
                    State {
                      Name
                    }
                    InstanceId
                    SecurityGroups {
                      GroupId
                    }
                  }
                }
              }
            }
            eu_central_1_ec2: ec2(config:{
              region: "eu-central-1"
            }) {
              describeInstances {
                Reservations {
                  Instances {
                    VpcId
                    Placement {
                      AvailabilityZone
                    }
                    State {
                      Name
                    }
                    InstanceId
                    SecurityGroups {
                      GroupId
                    }
                  }
                }
              }
            }
            eu_west_1_ec2: ec2(config:{
              region: "eu-west-1"
            }) {
              describeInstances {
                Reservations {
                  Instances {
                    VpcId
                    Placement {
                      AvailabilityZone
                    }
                    State {
                      Name
                    }
                    InstanceId
                    SecurityGroups {
                      GroupId
                    }
                  }
                }
              }
            }
            eu_west_2_ec2: ec2(config:{
              region: "eu-west-2"
            }) {
              describeInstances {
                Reservations {
                  Instances {
                    VpcId
                    Placement {
                      AvailabilityZone
                    }
                    State {
                      Name
                    }
                    InstanceId
                    SecurityGroups {
                      GroupId
                    }
                  }
                }
              }
            }
            eu_west_3_ec2: ec2(config:{
              region: "eu-west-3"
            }) {
              describeInstances {
                Reservations {
                  Instances {
                    VpcId
                    Placement {
                      AvailabilityZone
                    }
                    State {
                      Name
                    }
                    InstanceId
                    SecurityGroups {
                      GroupId
                    }
                  }
                }
              }
            }
            eu_north_1_ec2: ec2(config:{
              region: "eu-north-1"
            }) {
              describeInstances {
                Reservations {
                  Instances {
                    VpcId
                    Placement {
                      AvailabilityZone
                    }
                    State {
                      Name
                    }
                    InstanceId
                    SecurityGroups {
                      GroupId
                    }
                  }
                }
              }
            }
            sa_east_1_ec2: ec2(config:{
              region: "sa-east-1"
            }) {
              describeInstances {
                Reservations {
                  Instances {
                    VpcId
                    Placement {
                      AvailabilityZone
                    }
                    State {
                      Name
                    }
                    InstanceId
                    SecurityGroups {
                      GroupId
                    }
                  }
                }
              }
            }
            
            
            
            
            us_east_2_rds: rds(config:{
              region: "us-east-2"
            }) {
              describeDBInstances {
                DBInstances {
                  DBInstanceStatus
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
            us_east_1_rds: rds(config:{
              region: "us-east-1"
            }) {
              describeDBInstances {
                DBInstances {
                  DBInstanceStatus
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
            us_west_1_rds: rds(config:{
              region: "us-west-1"
            }) {
              describeDBInstances {
                DBInstances {
                  DBInstanceStatus
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
            us_west_2_rds: rds(config:{
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
                  DBInstanceStatus
                }
              }
            }
            ap_south_1_rds: rds(config:{
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
                  DBInstanceStatus
                }
              }
            }
            ap_northeast_2_rds: rds(config:{
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
                  DBInstanceStatus
                }
              }
            }
            ap_southeast_1_rds: rds(config:{
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
                  DBInstanceStatus
                }
              }
            }
            ap_southeast_2_rds: rds(config:{
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
                  DBInstanceStatus
                }
              }
            }
            ap_northeast_1_rds: rds(config:{
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
                  DBInstanceStatus
                }
              }
            }
            ca_central_1_rds: rds(config:{
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
                  DBInstanceStatus
                }
              }
            }
            eu_central_1_rds: rds(config:{
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
                  DBInstanceStatus
                }
              }
            }
            eu_west_1_rds: rds(config:{
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
                  DBInstanceStatus
                }
              }
            }
            eu_west_2_rds: rds(config:{
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
                  DBInstanceStatus
                }
              }
            }
            eu_west_3_rds: rds(config:{
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
                  DBInstanceStatus
                }
              }
            }
            eu_north_1_rds: rds(config:{
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
                  DBInstanceStatus
                }
              }
            }
            sa_east_1_rds: rds(config:{
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
                  DBInstanceStatus
                }
              }
            }
          }
        }
        `
      }
    }).then(result => {
      console.log("This is the result: ", result);
      const aws = result.data.data.aws;
      let graphData = new compileGraphData();
      let allRegionsPromisesArray = [];
      for (let regions in aws) {
        const regionArray = regions.split("_");
        const regionString =
          regionArray[0] + "-" + regionArray[1] + "-" + regionArray[2];
        if (regionArray[3] === "ec2") {
          allRegionsPromisesArray.push(
            new Promise((resolve, reject) => {
              graphData.compileEC2Data(
                aws[regions].describeInstances,
                regionString
              );
              resolve();
            })
          );
        } else if (regionArray[3] === "rds") {
          allRegionsPromisesArray.push(
            new Promise((resolve, reject) => {
              graphData.compileRDSData(
                aws[regions].describeDBInstances,
                regionString
              );
              resolve();
            })
          );
        }
      }
      Promise.all(allRegionsPromisesArray).then(() => {
        console.log(allRegionsPromisesArray);
        // graphData.createEdges();

        // const edgeTable = graphData.getEdgesData();
        const edgeTable = [];
        console.log("Heres the graph data for regions: ", edgeTable);
        const regionState = graphData.getRegionData();
        dispatch(getAWSInstancesFinished());
        dispatch({
          type: actionTypes.GET_AWS_INSTANCES,
          payload: {
            regionState,
            edgeTable,
            currentRegion: "all"
          }
        });
      });
    });
  };
};
