import React, {Component} from "react";

class Side_Panel extends Component {


  render() {

    let NodeDetails

    if(this.props.activeNode) {
      NodeDetails = JSON.stringify(this.props.activeNode);
    }

    return(
      <div id="sidePanel">
        <h4>Information about node: {this.props.activeNode.InstanceId ? this.props.activeNode.InstanceId: this.props.activeNode.DBInstanceIdentifier }</h4>
        <p>{NodeDetails}</p>
      </div>
    )
  }
}

export default Side_Panel;