//wrapper container for the entire react
import React, {Component} from "react";
import ReactDOM from "react-dom";
// import store from "../store";
import MainContainer from "./mainContainer";
import Menu from "../components/Menu.jsx"
import * as actions from "../actions/actions.js";
import { connect } from 'react-redux';
const {ipcRenderer} = require('electron');

// mainprocess.test() // was testing for credentials
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
  //get data on one single region
    getAWSInstances: (instances) => {
        dispatch(actions.getAWSInstances(instances));
    },
    //show details on specific nodes on click
    getNodeDetails: (data) => {
      dispatch(actions.getNodeDetails(data));
    },
    getAllRegions: (publicKey, privateKey) => {
      dispatch(actions.getAllRegions(publicKey,privateKey));
    },
    //get credentials from folder on computer
    getAWSKeys: (keys) => {
      dispatch(actions.getAWSKeys(keys));
    }
})

class App extends Component{

  componentDidMount() {
    //emits event to the back-end
    let reply = ipcRenderer.sendSync('getCredentials'); // render process sends info to electron via ipcRendered
    this.props.getAWSKeys(reply); // getAWSkeys is takes payload from action which is login and password
  // add login reducer just for login operations
}


  render(){
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