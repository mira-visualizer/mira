import React, {Component} from "react";
import ReactDOM from "react-dom";
// import store from "../store";
import MainContainer from "./mainContainer";
import Menu from "../components/Menu.jsx"
import * as actions from "../actions/actions.js";
import { connect } from 'react-redux';

const mapStateToProps = store => ({
  regionData: store.graph.regionData,
  activeNode: store.graph.activeNode,
  currentRegion: store.graph.currentRegion
})

const mapDispatchToProps = dispatch => ({
    getAWSInstances: (instances) => {
        dispatch(actions.getAWSInstances(instances));
    },

    getNodeDetails: (id) => {
      dispatch(actions.getNodeDetails(id));
    }
})

class App extends Component{
  render(){
    return(
      <div id="app">
        <Menu getAWSInstances={this.props.getAWSInstances} currentRegion={this.props.currentRegion} />
        <MainContainer getAWSInstances={this.props.getAWSInstances} regionData={this.props.regionData} getNodeDetails={this.props.getNodeDetails} activeNode={this.props.activeNode}/>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);