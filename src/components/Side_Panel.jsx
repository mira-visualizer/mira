import React, {Component} from "react";

class Side_Panel extends Component {


  render() {

    let NodeDetails

    if(this.props.activeNode) {
      NodeDetails = JSON.stringify(this.props.regionData);
    }

    return(
      <div id="sidePanel">
        <h4>Selected Node</h4>
        <p>{this.props.activeNode}</p>
        <h4>Node Details</h4>
        <p>{NodeDetails}</p>
        {console.log(Object.values(this.props.regionData))}
      </div>
    )
  }
}

export default Side_Panel;