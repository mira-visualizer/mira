import React, {Component} from "react";
import ReactJson from 'react-json-view'

class Side_Panel extends Component {


  render() {

    let NodeDetails;

    const reactJsonconfig = {
      indentWidth:1,
      name:this.props.activeNode.InstanceId,
      theme: 'apathy',
      
    }

    if(this.props.activeNode) {
      NodeDetails = ( <div id ="details-wrapper">
        <div id="details-header"><h4>Details</h4></div>
        <div id="details-sub-header"><h6>{this.props.activeNode.InstanceId ? this.props.activeNode.InstanceId: this.props.activeNode.DBInstanceIdentifier }</h6></div>
        <div id="main-info" className="node-info"><ReactJson src={this.props.activeNode} theme={reactJsonconfig.theme} indentWidth={reactJsonconfig.indentWidth}></ReactJson></div>
        <div id="sg-info" className="node-info"><ReactJson src={this.props.activeNode.MySecurityGroups} theme={reactJsonconfig.theme} indentWidth={reactJsonconfig.indentWidth}></ReactJson></div>        
        
      </div>)
        
      }

    return(
      <div id="sidePanel">
        {NodeDetails}
      </div>
    )
  }
}

export default Side_Panel;