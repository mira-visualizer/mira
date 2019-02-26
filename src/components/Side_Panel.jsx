import React, {Component} from "react";
import ReactJson from 'react-json-view'
import {Switch, BrowserRouter as Router, Route, NavLink, withRouter } from 'react-router-dom';
import SecGroupEdit from './Security_Group_Edit'


class Side_Panel extends Component {


  render() {

    let NodeDetails;

    const reactJsonconfig = {
      indentWidth:1,
      name:this.props.activeNode.InstanceId,
      theme: 'apathy',
      
    }

    if(this.props.activeNode) {
      NodeDetails = ( <div id ="details-wrapper">
        <div id="details-header"><h4>Details</h4></div>
        <div id="details-sub-header"><h6>{this.props.activeNode.InstanceId ? this.props.activeNode.InstanceId: this.props.activeNode.DBInstanceIdentifier }</h6></div>
        <div id="main-info" className="node-info"><ReactJson src={this.props.activeNode} theme={reactJsonconfig.theme} indentWidth={reactJsonconfig.indentWidth}></ReactJson></div>
        <div id="sg-info" className="node-info"><ReactJson src={this.props.activeNode.MySecurityGroups} theme={reactJsonconfig.theme} indentWidth={reactJsonconfig.indentWidth}></ReactJson></div>        
        
      </div>)
        
      }

      /*<Router>
        <div id="sidePanel">
          <a><NavLink to='/node-details'> Get Node Details</NavLink></a>
          <a><NavLink to='/edit-security-group'> Edit Security Groups </NavLink></a>
          
          <Switch>
            <Route
              path='/node-details'
              component={NodeDetails}
            />
            <Route
              path='/edit-security-group'
              render={(props) => <SecGroupEdit {...props} regionData={this.props.regionData} activeNode={this.props.activeNode}/>}
            />
          </Switch>
          
        </div>

      </Router>
      */

    return(
      <div id="sidePanel">
      <button id="modal-pop-up">Edit Security Groups</button>
      {NodeDetails}
    </div>
      
      
    )
  }
}

export default Side_Panel;