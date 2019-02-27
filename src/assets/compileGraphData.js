const AWS = require('aws-sdk');

class compileGraphData {
  constructor(){
    this.regionState = {};
    this.sgRelationships = []; //array of arrays where each inside looks like [ [inbound sg, outbound sg] ]
    this.sgNodeCorrelations = {};
    this.edgeTable = {};
    this.ec2 = new AWS.EC2({});
    console.log(this.ec2);
  }

  compileRDSData(data,region){
    AWS.config.update({
      region,
    });
      const innerPromiseArray =[];

    for(let i = 0; i < data.DBInstances.length; i ++){
            let DBinstances = data.DBInstances[i];
            //destructure the data for relevant data
            let {DBSubnetGroup: {VpcId}, AvailabilityZone, DbiResourceId, VpcSecurityGroups} = DBinstances;
            // if the property doesn't exist within the object, create an object to save all the data in
            if(!this.regionState.hasOwnProperty(VpcId))this.regionState[VpcId] = {};
            if(!this.regionState[VpcId].hasOwnProperty(AvailabilityZone))this.regionState[VpcId][AvailabilityZone] = {};
            if(!this.regionState[VpcId][AvailabilityZone].hasOwnProperty("RDS"))this.regionState[VpcId][AvailabilityZone].RDS ={};
            //save the data into the this.regionState object
            this.regionState[VpcId][AvailabilityZone].RDS[DbiResourceId] = DBinstances;

            innerPromiseArray.push(new Promise((resolve,reject) => {
              const param = {
                GroupIds:[]
              };
              for(let k = 0; k < VpcSecurityGroups.length; k++){
                param.GroupIds.push(VpcSecurityGroups[k].VpcSecurityGroupId); 
                
              }
              this.ec2.describeSecurityGroups(param, function(err, data) {
                if (err) {
                  console.log(err, err.stack);
                  reject();
                }
                else{

                  this.regionState[VpcId][AvailabilityZone].RDS[DbiResourceId].MySecurityGroups = data.SecurityGroups;
                  for(let h = 0; h < data.SecurityGroups.length; h++){

                    if(!this.sgNodeCorrelations[data.SecurityGroups[h].GroupId]) this.sgNodeCorrelations[data.SecurityGroups[h].GroupId]  = new Set();
                    this.sgNodeCorrelations[data.SecurityGroups[h].GroupId].add(DbiResourceId);

                    if(data.SecurityGroups[h].IpPermissions.length > 0){
                      for(let i = 0; i < data.SecurityGroups[h].IpPermissions[0].UserIdGroupPairs.length; i++ ){
                        this.sgRelationships.push([data.SecurityGroups[h].IpPermissions[0].UserIdGroupPairs[i].GroupId, data.SecurityGroups[h].GroupId])

                      }
                    }
                  }
                  resolve();

                }
              } )
            }))


          }
  }

  compileEC2Data(data, region){
    console.log("the region in compile data is ", region)
    const innerPromiseArray =[];
    for(let i = 0; i < data.Reservations.length; i ++){
      let instances = data.Reservations[i].Instances;
      for( let j = 0; j < instances.length; j++){
        let {VpcId, Placement: {AvailabilityZone}, InstanceId, SecurityGroups} = instances[j];
        if(!this.regionState.hasOwnProperty(VpcId))this.regionState[VpcId] = {};
        if(!this.regionState[VpcId].hasOwnProperty(AvailabilityZone))this.regionState[VpcId][AvailabilityZone] = {};
        if(!this.regionState[VpcId][AvailabilityZone].hasOwnProperty("EC2"))this.regionState[VpcId][AvailabilityZone].EC2 = {};
        this.regionState[VpcId][AvailabilityZone].EC2[InstanceId] = instances[j];
        
        //making a new promise to query for information about security group related to each EC2
        innerPromiseArray.push(new Promise((resolve,reject) => {
          const param = {
            GroupIds:[]
          };
          for(let k = 0; k < SecurityGroups.length; k++){
            param.GroupIds.push(SecurityGroups[k].GroupId); 
          }
                        AWS.config.update({
                          region,
                        });
          console.log("aws config? ", AWS.config);
              this.ec2.describeSecurityGroups(param, function(err, data) {
                if (err) {
                  console.log(err, err.stack);
                  reject();
                }
                else {
                  console.log('whatever sometiing unique')
                  this.regionState[VpcId][AvailabilityZone].EC2[InstanceId].MySecurityGroups = data.SecurityGroups;
                  for(let h = 0; h < data.SecurityGroups.length; h++){
                   
                    if(!this.sgNodeCorrelations[data.SecurityGroups[h].GroupId]) this.sgNodeCorrelations[data.SecurityGroups[h].GroupId]  = new Set();
                    this.sgNodeCorrelations[data.SecurityGroups[h].GroupId].add(InstanceId);
                    
                    if(data.SecurityGroups[h].IpPermissions.length > 0){
                    
                      for(let i = 0; i < data.SecurityGroups[h].IpPermissions[0].UserIdGroupPairs.length; i++ ){
                        this.sgRelationships.push([data.SecurityGroups[h].IpPermissions[0].UserIdGroupPairs[i].GroupId, data.SecurityGroups[h].GroupId])

                      }
                    }
                  }
                  resolve();
                  }
              } )
            }))
          }
        }
  }
  createEdges(){
     for(let i = 0; i < this.sgRelationships.length; i++){
      this.sgNodeCorrelations[this.sgRelationships[i][0]].forEach( function(val1, val2, set){
        this.sgNodeCorrelations[this.sgRelationships[i][1]].forEach( function(value1, value2, set2){
        if(!this.edgeTable.hasOwnProperty(val1)) this.edgeTable[val1]= new Set();
          this.edgeTable[val1].add(value1);
        })
      })
    } 
  }

  getRegionData(){
    return this.regionState;
  }
  getEdgesData(){
    return this.edgeTable;
  }
}

export default compileGraphData;
