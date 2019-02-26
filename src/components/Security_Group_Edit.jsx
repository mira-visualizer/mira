import React, { Component } from 'react';

const AWS = require('aws-sdk');

class Security_Group_Edit extends Component{

  constructor(props){
    super(props)
    this.state = {
      index : 0,
      inbound: false,
      outbound: false,
      sgDataArray:[]
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInOut = this.handleInOut.bind(this);
    this.getSgTotal = this.getSgTotal.bind(this);
    this.checkSource = this.checkSource.bind(this);

  }

  getSgTotal(){
    console.log(this.props.sgData);
    const {sgData} = this.props;
    const groupIds = [];
    for(let i = 0; i < sgData.length; i++){
      groupIds.push(<option id="GroupId" value={sgData[i].GroupId} ref={(input) => this.GroupId = input}>{sgData[i].GroupId}</option>);
    }
    return groupIds;
  }

  handleChange(event) {
    this.setState({
      index: event.target.value
    });
  }
  handleInOut(event) {
    this.getSgTotal();
    if(event.target.value === 'inbound' && this.state.inbound === false){
      this.setState({
        inbound: true,
        outbound: false
      })
    }
    if(event.target.value === 'outbound' && this.state.outbound === false){
      this.setState({
        inbound: false,
        outbound: true
      })
    }
  }

  checkSource(input){
    const cidrRegex = "^([0-9]{1,3}\.){3}[0-9]{1,3}(\/([0-9]|[1-2][0-9]|3[0-2]))?$";
    if(input.match(cidrRegex)) return true;
  }

  handleSubmit(event){
    let ranges;
    let toPort;
    if(this.portRange.value == 'all' || this.portRange.value === 'All'){
      ranges = [0];
      toPort = 65535;
    } else {
      ranges = this.portRange.value.split("-");
      toPort = ranges.length > 1 ? ranges[1]:ranges[0];
    } 
    // async call to do get the api, then refresh
    console.log("type of ", typeof this.source.value)
    const ec2 = new AWS.EC2();
    const params = {
      GroupId: this.GroupId.value, 
      IpPermissions: [
         {
        FromPort: ranges[0], 
        IpProtocol: this.protocol.value, 
        ToPort: toPort
       }
      ]
     };

     if(this.checkSource(this.source.value)){
       params.IpPermissions[0].IpRanges = [{CidrIp:this.source.value, Description:this.description.value}]
     }
     else{
        params.IpPermissions[0].UserIdGroupPairs = [{GroupId:this.source.value, Description:this.description.value}]

     }
     if(this.state.inbound) {
      ec2.authorizeSecurityGroupIngress(params, function(err, data) {
        if (err) console.log('Data not inputted in correct format', err, err.stack); // an error occurred
        else     console.log(data);           // successful response
      });
     } else if (this.state.outbound) {
       ec2.authorizeSecurityGroupEgress(params, function(err, data) {
        if (err) console.log('Data not inputted in correct format', err, err.stack); // an error occurred
        else     console.log(data);           // successful response
       }); 
     } else {
       alert('missing choices');
     }
     
    event.preventDefault();
  }

  render(){

  const AutofillData = [
    {
      type: 'Custom TCP Rule',
      Protocol: 'TCP',
      PortRange: ''
    },{
      type: 'Custom UDP Rule',
      Protocol: 'UDP',
      PortRange: ''
    },{
      type: 'Custom ICMP Rule - IPv4',
      Protocol: [],
      PortRange: 'N/A'
    },{
      type: 'Custom ICMP Rule - IPv6',
      Protocol: 'IPV6 ICMP',
      PortRange: 'All'
    },{
      type: 'Custom Protocol',
      Protocol: '',
      PortRange: 'all'
    },{
      type: 'All TCP',
      Protocol: 'TCP',
      PortRange: '0-65535'
    },{
      type: 'All UDP',
      Protocol: 'UDP',
      PortRange: '0-65535'
    },{
      type: 'All ICMP - IPv4',
      Protocol: 'ICMP',
      PortRange: '0-65535'
    },{
      type: 'All ICMP - IPv6',
      Protocol: 'IPV6 ICMP',
      PortRange: 'All'
    },{
      type: 'All traffic',
      Protocol: 'All',
      PortRange: '0-65535'
    },{
      type: 'SSH',
      Protocol: 'TCP',
      PortRange: '22'
    },{
      type: 'SMTP',
      Protocol: 'TCP',
      PortRange: '25'
    },{
      type: 'DNS (UDP)',
      Protocol: 'UDP',
      PortRange: '53'
    },{
      type: 'DNS (TCP)',
      Protocol: 'TCP',
      PortRange: '53'
    },{
      type: 'HTTP',
      Protocol: 'TCP',
      PortRange: '80'
    },{
      type: 'POP3',
      Protocol: 'TCP',
      PortRange: '110'
    },
    {
      type: 'IMAP',
      Protocol: 'TCP',
      PortRange: '143'
    },
    {
      type: 'LDAP',
      Protocol: 'TCP',
      PortRange: '389'
    },
    {
      type: 'HTTPS',
      Protocol: 'TCP',
      PortRange: '443'
    },
    {
      type: 'SMB',
      Protocol: 'TCP',
      PortRange: '445'
    },
    {
      type: 'SMTPS',
      Protocol: 'TCP',
      PortRange: '465'
    },
    {
      type: 'IMAPS',
      Protocol: 'TCP',
      PortRange: '993'
    },
    {
      type: 'POP3S',
      Protocol: 'TCP',
      PortRange: '995'
    },
    {
      type: 'MS SQL',
      Protocol: 'TCP',
      PortRange: '1433'
    },
    {
      type: 'NFS',
      Protocol: 'TCP',
      PortRange: '2049'
    },
    {
      type: 'MYSQL/Aurora',
      Protocol: 'TCP',
      PortRange: '3306'
    },
    {
      type: 'RDP',
      Protocol: 'TCP',
      PortRange: '3389'
    },
    {
      type: 'Redshift',
      Protocol: 'TCP',
      PortRange: '5439'
    },
    {
      type: 'PostgreSQL',
      Protocol: 'TCP',
      PortRange: '5432'
    },
    {
      type: 'Oracle-RDS',
      Protocol: 'TCP',
      PortRange: '1521'
    },
    {
      type: 'WinRM-HTTP',
      Protocol: 'TCP',
      PortRange: '5985'
    },
    {
      type: 'WinRM-HTTPS',
      Protocol: 'TCP',
      PortRange: '5986'
    },
    {
      type: 'Elastic Graphics',
      Protocol: 'TCP',
      PortRange: '2007'
    }
  ]

  const AutoFillArray = [];
  for( let i = 0; i < AutofillData.length; i +=1 ){
    AutoFillArray.push(<option id="type" ref={(input) => this.type = input} value={i}>{AutofillData[i].type} </option>)
  }


  return (
    <div id='modal-table'>
    <form onSubmit={this.handleSubmit}>
      <h2> Edit Inbound and Outbound Security Groups</h2>
        <select>
          {this.getSgTotal()}
        </select>
        <label>
          <input type="radio" value="inbound" checked={this.state.inbound} onClick={this.handleInOut} />
          Inbound (Ingress)
        </label>
        <label>
          <input type="radio" value="outbound" checked={this.state.outbound} onClick={this.handleInOut} />
          Outbound (Egress)
        </label>
      <table>
        <tr>
          <th>Type</th>
          <th>Protocol</th>
          <th>Port Range</th>
          <th>Source</th>
          <th>Description</th>
        </tr>
        <tr>
          <th>
            <select onChange={this.handleChange}>
             {AutoFillArray}
            </select>
          </th>
          <th> <input id="protocol" type="text" value={AutofillData[this.state.index].Protocol} ref={(input) => this.protocol = input}/></th>
          <th> <input id="portRange" type="text" defaultValue={AutofillData[this.state.index].PortRange} ref={(input) => this.portRange = input}/></th>
          <th> <select> 
            <option value="Custom">Custom</option>
            <option value="Anywhere">Anywhere</option>
            <option value="My IP">My IP</option>
            </select>
            <input id="Source" type="text" ref={(input) => this.source = input} /></th>
          <th> <input id="Description" type="text" ref={(input) => this.description = input} /></th>
        </tr>
      </table>
      <input type="submit" value="Submit"/>
    </form>
    </div>
    )
  }
}



export default Security_Group_Edit;