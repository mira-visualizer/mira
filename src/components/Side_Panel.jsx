import React, {Component} from "react";
import ReactJson from 'react-json-view'
import {Switch, BrowserRouter as Router, Route, NavLink, withRouter } from 'react-router-dom';
import SecGroupEdit from './Security_Group_Edit'
import Modal from 'react-modal';
import Collapsible from 'react-collapsible';

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

class Side_Panel extends Component {
  constructor() {
    super();

    this.state = {
      modalIsOpen: false
    };

    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  openModal() {
    this.setState({modalIsOpen: true});
  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.
    // this.subtitle.style.color = '#f00';
  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }


  render() {

    let NodeDetails;
    let sgmodal;
    let sidePanelWelcome;

    const reactJsonconfig = {
      indentWidth:1,
      name:this.props.activeNode.InstanceId,
      theme: 'bright:inverted',
      
    }

    if(this.props.activeNode) {
      console.log('BRAHHH',this.props.activeNode);
      NodeDetails = ( <div id ="details-wrapper">
        <Collapsible trigger="Node Summary" open="true">
          <p><span className="sidebar-title">Instance Type: </span><span>{this.props.activeNode.InstanceId ? 'EC2': 'RDS'}</span></p>
          <p><span className="sidebar-title">Instance ID: </span><span>{this.props.activeNode.InstanceId ? this.props.activeNode.InstanceId: this.props.activeNode.DBInstanceIdentifier}</span></p>
          <p><span className="sidebar-title">Instance Status: </span><span>{this.props.activeNode.InstanceId ? this.props.activeNode.State.Name : this.props.activeNode.DBInstanceStatus}</span></p>

        </Collapsible>
        <Collapsible trigger="Node Details" open="true">
          <div id="main-info" className="node-info"><ReactJson src={this.props.activeNode} theme={reactJsonconfig.theme} indentWidth={reactJsonconfig.indentWidth}></ReactJson></div>
        </Collapsible>
        <Collapsible trigger="Security Group Details" open="true">
          <div id="sg-info" className="node-info"><ReactJson src={this.props.activeNode.MySecurityGroups} theme={reactJsonconfig.theme} indentWidth={reactJsonconfig.indentWidth}></ReactJson></div>        
        </Collapsible>
      </div>);
      sgmodal = (
        <button id="modal-pop-up" onClick={this.openModal}>Edit Security Groups</button>
      )
      }
      // Displaying the 
      else{
        sidePanelWelcome = ( <div id="side-panel-welcome"> Click on a node to get more infogroups 
        </div>
        )
      }
    

    return(
      <div id="sidePanel">
      {sgmodal}
      {sidePanelWelcome}
      <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
        
          <SecGroupEdit sgData={this.props.activeNode.MySecurityGroups} onRequestClose={this.closeModal} />
          <button onClick={this.closeModal}>close</button>
        </Modal>
      {NodeDetails}
    </div>
      
    )
  }
}

export default Side_Panel;