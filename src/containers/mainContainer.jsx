import React, {Component} from 'react';
import GraphContainer from "./graphContainer";
import Side_Panel from "../components/Side_Panel";

class MainContainer extends Component{
  render() {
    return (
        <div id="mainContainer">
          <GraphContainer/>
          <Side_Panel/>
        </div>
    )
  }
}

export default MainContainer;