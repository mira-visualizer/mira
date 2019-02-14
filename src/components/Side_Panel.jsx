import React, {Component} from "react";

class Side_Panel extends Component {
  render() {
    return(
      <div id="sidePanel">
        {JSON.stringify(this.props.regionData)}
      </div>
    )
  }
}

export default Side_Panel;