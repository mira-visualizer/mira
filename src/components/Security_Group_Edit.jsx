import React, {Component} from "react";
const AWS = require('aws-sdk');
class Security_Group_Edit extends Component {
  render(){
    const s3 = new AWS.S3();
    const rds = new AWS.RDS();
    const ec2 = new AWS.EC2();

    let params = {
    }
    
    // ec2.authorizeSecurityGroupEgress(params, function(err, data) {
    //  if (err) console.log(err, err.stack); // an error occurred
    //  else     console.log(data);           // successful response
    // });        


    // have a few if statements to determine which api call to use
    // change ingress (inbound rule) of security group
        // remove and add
    // change egress (outbound rule) of security group
        // remove and add
    // create a security group
  return (
    <div>
      <form>
        <option value="Custom TCP Rule">Custom TCP Rule</option>
        <option value="Custom UDP Rule">Custom UDP Rule</option>
        <option value="Custom ICMP Rule - IPv4">Custom ICMP Rule - IPv4</option>
        <option value="Custom ICMP Rule - IPv6">Custom ICMP Rule - IPv6</option>
        <option value="Custom Protocol">Custom Protocol</option>
        <option value='All TCP'>All TCP</option>
        <option value="All UDP">All UDP</option>
        <option value="All ICMP -IPv4">All ICMP - IPv4</option>
        <option value="All traffic">All traffic</option>
        <option value="SSH">SSH</option>
        <option value="SMTP">SMTP</option>
        <option value="DNS(UDP)">DNS(UDP)</option>
        <option value="DNS(TCP)">DNS(TCP)</option>
        <option value="HTTP">HTTP</option>
        <option value="POP3">POP3</option>
        <option value="IMAP">IMAP</option>
        <option value="LDAP">LDAP</option>
        <option value="HTTPS">HTTPS</option>
        <option value="SMB">SMB</option>
        <option value="SMTPS">SMTPS</option>
        <option value="IMAPS">IMAPS</option>
        <option value="POP3S">POP3S</option>
        <option value="MS SQL">MS SQL</option>
        <option value="NFS">NFS</option>
        <option value="MYSQL/AURORA">MYSQL/AURORA</option>
        <option value="RDP">RDP</option>
        <option value="Redshift">Redshift</option>
        <option value="PostgreSQL">PostgreSQL</option>
        <option value="Oracle-RDS">Oracle-RDS</option>
        <option value="WinRM-HTTP">WinRM-HTTP</option>
        <option value="WinRM-HTTPS">WinRM-HTTPS</option>
        <option value="Elastic Graphics">Elastic Graphics</option>

      </form>
    </div>
    )
  }
}

export default Security_Group_Edit;