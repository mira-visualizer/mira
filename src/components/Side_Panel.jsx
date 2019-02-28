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

    const reactJsonconfig = {
      indentWidth:1,
      name:this.props.activeNode.InstanceId,
      theme: 'apathy',
      
    }

    if(this.props.activeNode) {
      NodeDetails = ( <div id ="details-wrapper">
        <Collapsible trigger="Start here">
        <p>This is the collapsible content. It can be any element or React component you like.</p>
        <p>It can even be another Collapsible component. Check out the next section!</p>
        </Collapsible>
        <div id="details-header"><h4>Details</h4></div>
        <div id="details-sub-header"><h6>{this.props.activeNode.InstanceId ? this.props.activeNode.InstanceId: this.props.activeNode.DBInstanceIdentifier }</h6></div>
        <div id="main-info" className="node-info"><ReactJson src={this.props.activeNode} theme={reactJsonconfig.theme} indentWidth={reactJsonconfig.indentWidth}></ReactJson></div>
        <div id="sg-info" className="node-info"><ReactJson src={this.props.activeNode.MySecurityGroups} theme={reactJsonconfig.theme} indentWidth={reactJsonconfig.indentWidth}></ReactJson></div>        
      </div>);
      sgmodal = (
        <button id="modal-pop-up" onClick={this.openModal}>Edit Security Groups</button>
      )
      }
    

    return(
      <div id="sidePanel">
      {sgmodal}
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