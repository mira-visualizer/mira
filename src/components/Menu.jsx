import React, {Component} from "react";

class Menu extends Component {
  render() {
    return (
      <div id="Menu">
        <select>
          <option value="select-region">Select Region</option>
          <option value="us-east-2">us-east-2</option>
          <option value="us-east-1">us-east-1</option>
          <option value="us-west-2">us-west-2</option>
          <option value="us-west-1">us-west-1</option>
        </select>
        <button id="refresh">Refresh</button>
      </div>
    )
  }
}

export default Menu;