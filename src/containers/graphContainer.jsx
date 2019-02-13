import React, {Component} from 'react';
import { connect } from 'react-redux';

import * as actions from '../actions/actions.js';

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
      <div id="graph">
      <button onClick={this.props.getEC2}>GET ALL</button>
        {/* {state.ec2} */}
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(graphContainer);