import React, {Component} from 'react';
import { connect } from 'react-redux';

import Cyto from '../cyto/cyto';
import '../styles/App.scss';


class Graph extends Component{
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div id="graphContainer">
        <div id="graph">
        </div>
        <div id="cytoscape">
          <Cyto regionData={this.props.regionData} getNodeDetails={this.props.getNodeDetails}/>
        </div>
      </div>
    )
  }
}

export default Graph