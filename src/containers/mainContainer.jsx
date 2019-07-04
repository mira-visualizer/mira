import React, {Component} from 'react';
import Graph from "../components/Graph";
import Side_Panel from "../components/Side_Panel";


class MainContainer extends Component{
  //SIDE PANEL RENDERS CONDITIONALLY
  render() {
    return (
        <div id="mainContainer">
          <Graph getAWSInstances={this.props.getAWSInstances} regionData={this.props.regionData} getNodeDetails={this.props.getNodeDetails}  fetchingFlag={this.props.fetchingFlag} finishedFlag={this.props.finishedFlag}
          edgeTable= {this.props.edgeTable}/>
          {/* sgRelationships={this.props.sgRelationships}
          sgNodeCorrelations={this.props.sgNodeCorrelations}/> */}
          <Side_Panel regionData={this.props.regionData} activeNode={this.props.activeNode}/>
        </div>
    )
  }
}

export default MainContainer;