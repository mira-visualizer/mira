import React, {Component} from 'react';
import GraphContainer from "./graphContainer";
import Side_Panel from "../components/Side_Panel";
import * as actions from "../actions/actions.js";
import { connect } from 'react-redux';


const mapStateToProps = store => ({
  regionData: store.graph.regionData,
  activeNode: store.graph.activeNode
  // ec2: store.graph.ec2Instances,
})

const mapDispatchToProps = dispatch => ({
    getEC2: (ec2) => {
        dispatch(actions.getEC2(ec2));
    },

    getNodeDetails: (id) => {
      dispatch(actions.getNodeDetails(id));
    }
})

class MainContainer extends Component{
  render() {
    return (
        <div id="mainContainer">
          <GraphContainer getEC2={this.props.getEC2} regionData={this.props.regionData} getNodeDetails={this.props.getNodeDetails} />
          <Side_Panel regionData={this.props.regionData}/>
        </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainContainer);