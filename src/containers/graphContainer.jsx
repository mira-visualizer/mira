import React, {Component} from 'react';
import { connect } from 'react-redux';

import * as actions from '../actions/actions.js';
import Cyto from '../cyto/cyto';
import '../styles/App.scss';

const mapStateToProps = store => ({
  everthing: store,
  ec2: store.graph.ec2Instances,
})

const mapDispatchToProps = dispatch => ({
    getEC2: (ec2) => {
        dispatch(actions.getEC2(ec2));
    }
})

class GraphContainer extends Component{
  constructor(props) {
    super(props);
  }
  render() {
    return (
        <div id="graphContainer">
          <Cyto/>
        </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GraphContainer);