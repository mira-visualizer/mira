import React,{Component} from 'react';
import cytoscape from 'cytoscape';
import './cyto.css';
import EC2 from './EC2'
import S3 from './S3'
import VPC from './VPC'
import AvailabilityZone from './AvailabilityZone'
import cola from 'cytoscape-cola';
// import popper from 'cytoscape-popper';
// var cyqtip = require('cytoscape-qtip');

// cyqtip( cytoscape );

// cytoscape.use( popper );
// import data from './sample.js'

cytoscape.use( cola );

const data = [
  {
      "Groups": [],
      "Instances": [
          {
              "AmiLaunchIndex": 0,
              "ImageId": "ami-032509850cf9ee54e",
              "InstanceId": "i-098ccfdf338675885",
              "InstanceType": "t2.micro",
              "KeyName": "testkeypair",
              "LaunchTime": "2019-02-08T01:31:08.000Z",
              "Monitoring": {
                  "State": "disabled"
              },
              "Placement": {
                  "AvailabilityZone": "us-west-2b",
                  "GroupName": "",
                  "Tenancy": "default"
              },
              "PrivateDnsName": "ip-172-31-28-190.us-west-2.compute.internal",
              "PrivateIpAddress": "172.31.28.190",
              "ProductCodes": [],
              "PublicDnsName": "ec2-35-161-98-86.us-west-2.compute.amazonaws.com",
              "PublicIpAddress": "35.161.98.86",
              "State": {
                  "Code": 16,
                  "Name": "running"
              },
              "StateTransitionReason": "",
              "SubnetId": "subnet-7c034e19",
              "VpcId": "vpc-d2681ab7",
              "Architecture": "x86_64",
              "BlockDeviceMappings": [
                  {
                      "DeviceName": "\/dev\/xvda",
                      "Ebs": {
                          "AttachTime": "2019-02-08T01:31:09.000Z",
                          "DeleteOnTermination": true,
                          "Status": "attached",
                          "VolumeId": "vol-0c4a0b0fb5bcedfef"
                      }
                  }
              ],
              "ClientToken": "",
              "EbsOptimized": false,
              "EnaSupport": true,
              "Hypervisor": "xen",
              "ElasticGpuAssociations": [],
              "ElasticInferenceAcceleratorAssociations": [],
              "NetworkInterfaces": [
                  {
                      "Association": {
                          "IpOwnerId": "amazon",
                          "PublicDnsName": "ec2-35-161-98-86.us-west-2.compute.amazonaws.com",
                          "PublicIp": "35.161.98.86"
                      },
                      "Attachment": {
                          "AttachTime": "2019-02-08T01:31:08.000Z",
                          "AttachmentId": "eni-attach-08713c39e3125bc9a",
                          "DeleteOnTermination": true,
                          "DeviceIndex": 0,
                          "Status": "attached"
                      },
                      "Description": "",
                      "Groups": [
                          {
                              "GroupName": "launch-wizard-2",
                              "GroupId": "sg-0ac3d6ea0b496701e"
                          }
                      ],
                      "Ipv6Addresses": [],
                      "MacAddress": "02:31:93:75:7e:d2",
                      "NetworkInterfaceId": "eni-0a675aa06da907914",
                      "OwnerId": "418200874674",
                      "PrivateDnsName": "ip-172-31-28-190.us-west-2.compute.internal",
                      "PrivateIpAddress": "172.31.28.190",
                      "PrivateIpAddresses": [
                          {
                              "Association": {
                                  "IpOwnerId": "amazon",
                                  "PublicDnsName": "ec2-35-161-98-86.us-west-2.compute.amazonaws.com",
                                  "PublicIp": "35.161.98.86"
                              },
                              "Primary": true,
                              "PrivateDnsName": "ip-172-31-28-190.us-west-2.compute.internal",
                              "PrivateIpAddress": "172.31.28.190"
                          }
                      ],
                      "SourceDestCheck": true,
                      "Status": "in-use",
                      "SubnetId": "subnet-7c034e19",
                      "VpcId": "vpc-d2681ab7"
                  }
              ],
              "RootDeviceName": "\/dev\/xvda",
              "RootDeviceType": "ebs",
              "SecurityGroups": [
                  {
                      "GroupName": "launch-wizard-2",
                      "GroupId": "sg-0ac3d6ea0b496701e"
                  }
              ],
              "SourceDestCheck": true,
              "Tags": [],
              "VirtualizationType": "hvm",
              "CpuOptions": {
                  "CoreCount": 1,
                  "ThreadsPerCore": 1
              },
              "HibernationOptions": {
                  "Configured": false
              },
              "Licenses": []
          }
      ],
      "OwnerId": "418200874674",
      "ReservationId": "r-040cf0175a48671b2"
  },
  {
      "Groups": [],
      "Instances": [
          {
              "AmiLaunchIndex": 0,
              "ImageId": "ami-032509850cf9ee54e",
              "InstanceId": "i-01aad6133aa785cf9",
              "InstanceType": "t2.micro",
              "KeyName": "testkeypair",
              "LaunchTime": "2019-02-06T18:56:04.000Z",
              "Monitoring": {
                  "State": "enabled"
              },
              "Placement": {
                  "AvailabilityZone": "us-west-2b",
                  "GroupName": "",
                  "Tenancy": "default"
              },
              "PrivateDnsName": "ip-172-31-19-92.us-west-2.compute.internal",
              "PrivateIpAddress": "172.31.19.92",
              "ProductCodes": [],
              "PublicDnsName": "ec2-35-163-188-89.us-west-2.compute.amazonaws.com",
              "PublicIpAddress": "35.163.188.89",
              "State": {
                  "Code": 16,
                  "Name": "running"
              },
              "StateTransitionReason": "",
              "SubnetId": "subnet-7c034e19",
              "VpcId": "vpc-d2681ab7",
              "Architecture": "x86_64",
              "BlockDeviceMappings": [
                  {
                      "DeviceName": "\/dev\/xvda",
                      "Ebs": {
                          "AttachTime": "2019-02-06T18:56:05.000Z",
                          "DeleteOnTermination": true,
                          "Status": "attached",
                          "VolumeId": "vol-01e1a8c1a7531d170"
                      }
                  }
              ],
              "ClientToken": "",
              "EbsOptimized": false,
              "EnaSupport": true,
              "Hypervisor": "xen",
              "ElasticGpuAssociations": [],
              "ElasticInferenceAcceleratorAssociations": [],
              "NetworkInterfaces": [
                  {
                      "Association": {
                          "IpOwnerId": "amazon",
                          "PublicDnsName": "ec2-35-163-188-89.us-west-2.compute.amazonaws.com",
                          "PublicIp": "35.163.188.89"
                      },
                      "Attachment": {
                          "AttachTime": "2019-02-06T18:56:04.000Z",
                          "AttachmentId": "eni-attach-0b7810d4d88d2a5aa",
                          "DeleteOnTermination": true,
                          "DeviceIndex": 0,
                          "Status": "attached"
                      },
                      "Description": "",
                      "Groups": [
                          {
                              "GroupName": "launch-wizard-1",
                              "GroupId": "sg-0405f31376ef53390"
                          }
                      ],
                      "Ipv6Addresses": [],
                      "MacAddress": "02:11:a9:e4:6c:ac",
                      "NetworkInterfaceId": "eni-0f24d25d44400aa97",
                      "OwnerId": "418200874674",
                      "PrivateDnsName": "ip-172-31-19-92.us-west-2.compute.internal",
                      "PrivateIpAddress": "172.31.19.92",
                      "PrivateIpAddresses": [
                          {
                              "Association": {
                                  "IpOwnerId": "amazon",
                                  "PublicDnsName": "ec2-35-163-188-89.us-west-2.compute.amazonaws.com",
                                  "PublicIp": "35.163.188.89"
                              },
                              "Primary": true,
                              "PrivateDnsName": "ip-172-31-19-92.us-west-2.compute.internal",
                              "PrivateIpAddress": "172.31.19.92"
                          }
                      ],
                      "SourceDestCheck": true,
                      "Status": "in-use",
                      "SubnetId": "subnet-7c034e19",
                      "VpcId": "vpc-d2681ab7"
                  }
              ],
              "RootDeviceName": "\/dev\/xvda",
              "RootDeviceType": "ebs",
              "SecurityGroups": [
                  {
                      "GroupName": "launch-wizard-1",
                      "GroupId": "sg-0405f31376ef53390"
                  }
              ],
              "SourceDestCheck": true,
              "Tags": [],
              "VirtualizationType": "hvm",
              "CpuOptions": {
                  "CoreCount": 1,
                  "ThreadsPerCore": 1
              },
              "CapacityReservationSpecification": {
                  "CapacityReservationPreference": "open"
              },
              "HibernationOptions": {
                  "Configured": false
              },
              "Licenses": []
          }
      ],
      "OwnerId": "418200874674",
      "ReservationId": "r-0b0e512ce43a8328a"
  }
]

class Cyto extends Component{
  constructor(props){
    super(props);
    this.renderElement = this.renderElement.bind(this);
    this.cy = null;
    this.nodes = {};
    console.log(data);

  }
  renderElement(){
    this.cy = cytoscape({
      container: document.getElementById('cy'),
    
      boxSelectionEnabled: false,
      autounselectify: true,
      layout: {
        name: 'cola',
        flow: { axis: 'y', minSeparation: 40 },
        avoidOverlap: true
      },

      style: cytoscape.stylesheet()
        .selector('node')
          .css({
            'height': 80,
            'width': 80,
            'background-fit': 'cover',
            'border-color': '#000',
            'border-width': 3,
            'border-opacity': 0.5,
            'text-halign': 'center',
            'text-valign': 'center',
            'label': 'data(label)'


          })
        .selector(':parent')
          .css({
            'font-weight': 'bold',
            'background-opacity': 0.075,
            'content': 'data(label)',
            'text-valign': 'top',
          })
          .selector('edge')
          .css({
            'curve-style': 'bezier',
            'width': 6,
            'target-arrow-shape': 'triangle',
            'line-color': '#ffaaaa',
            'target-arrow-color': '#ffaaaa',
            'opacity': 0.5
          })
          
        });
      
        /**
         *  VPCs just pass in the id
         *  Availability Zone pass in the ID and the VPC's ID
         *  EC2( data, parent, source)
         *  S3 ( data, parent, source )
         */

      this.cy.add(new VPC("vpc-d2681ab7").getVPCObject());
      this.cy.add(new AvailabilityZone("us-west-2b","vpc-d2681ab7").getAvailabilityZoneObject());
      this.cy.add(new EC2({id:0}, "us-west-2b" , null).getEC2Object());
      this.cy.add(new EC2({id:1}, "us-west-2b" , 0).getEC2Object());
      this.cy.add(new AvailabilityZone("us-west-1a","vpc-d2681ab7").getAvailabilityZoneObject());
      this.cy.add(new EC2({id:2}, "us-west-1a", 1).getEC2Object());
      this.cy.add(new S3({id: 3},"us-west-2b",1).getS3Object());

        this.cy.on('tap', 'node', function (evt){
          console.log("The id of the node clicked is ", this.id());
        })
      }

      componentDidMount(){
        this.renderElement();
        this.cy.layout({name: 'cola', flow: { axis: 'y', minSeparation: 40}, avoidOverlap: true}).run();

        // 
      }

      render(){
        return(
            <div className="node_selected">
                <div id="cy"></div>
            </div>
        )
    }
          
};

export default Cyto;