import React, {Component} from 'react';
import { connect } from 'react-redux';

import * as actions from '../actions/actions.js';
import Cyto from '../cyto/cyto';
import '../style/App.css';

const mapStateToProps = store => ({
  everthing: store,
  ec2: store.graph.ec2Instances,
})

const mapDispatchToProps = dispatch => ({
    getEC2: (ec2) => {
        dispatch(actions.getEC2(ec2));
    }
})

class graphContainer extends Component{
  constructor(props) {
    super(props);
  }
  render() {
    console.log(this.props);
    return (
      <div id="main-container">
      
        <div id="graph">
          <button onClick={this.props.getEC2}>GET ALL EC2</button>
        </div>
        <div id="cytoscape">
          <Cyto/>
        </div>

      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(graphContainer);