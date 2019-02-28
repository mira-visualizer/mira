import React, {Component} from "react";
import ReactDOM from "react-dom";
// import store from "../store";
import MainContainer from "./mainContainer";
import Menu from "../components/Menu.jsx"
import * as actions from "../actions/actions.js";
import { connect } from 'react-redux';
const {ipcRenderer} = require('electron');

const mapStateToProps = store => ({
  regionData: store.graph.regionData,
  activeNode: store.graph.activeNode,
  currentRegion: store.graph.currentRegion,
  edgeTable: store.graph.edgeTable,
  // sgNodeCorrelations: store.graph.sgNodeCorrelations,
  // sgRelationships: store.graph.sgRelationships,
  fetchingFlag: store.graph.fetching,
  finishedFlag: store.graph.fetched,
  publicKey: store.graph.awsPublicKey,
  privateKey: store.graph.awsPrivateKey
})

const mapDispatchToProps = dispatch => ({
    getAWSInstances: (instances) => {
        dispatch(actions.getAWSInstances(instances));
    },
    getNodeDetails: (data) => {
      dispatch(actions.getNodeDetails(data));
    },
    getAllRegions: (publicKey, privateKey) => {
      dispatch(actions.getAllRegions(publicKey,privateKey));
    },
    getAWSKeys: (keys) => {
      dispatch(actions.getAWSKeys(keys));
    }
})

class App extends Component{

  componentDidMount() {
    let reply = ipcRenderer.sendSync('getCredentials');
    this.props.getAWSKeys(reply);
  }


  render(){
    console.log('FLAAAA',this.props.publicKey);
    return(
      <div id="app">
        <Menu publicKey={this.props.publicKey} privateKey={this.props.privateKey} getAWSInstances={this.props.getAWSInstances} currentRegion={this.props.currentRegion} getAllRegions={this.props.getAllRegions} />
        <MainContainer getAWSInstances={this.props.getAWSInstances} regionData={this.props.regionData} 
        getNodeDetails={this.props.getNodeDetails} activeNode={this.props.activeNode} fetchingFlag={this.props.fetchingFlag} finishedFlag={this.props.finishedFlag}
        edgeTable= {this.props.edgeTable}/>
{/* 
        sgRelationships={this.props.sgRelationships}
        sgNodeCorrelations={this.props.sgNodeCorrelations}/> */}
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);