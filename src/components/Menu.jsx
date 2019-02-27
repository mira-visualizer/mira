import React, { Component } from 'react';
import axios from 'axios';
import { getAWSInstances } from '../actions/actions';

class Menu extends Component {
  render() {
    // want to setState to the active value
    const handleChange = (event) => {
      if (event.target.value !== 'select-region') {
        if (event.target.value === 'display-all') {
          this.props.getAllRegions();
        } else {
          this.props.getAWSInstances(event.target.value);
        }
      }
    };
    const refresh = () => {
      this.props.getAWSInstances(this.props.currentRegion);
    };
    return (
      <div id="Menu">
        <select onChange={handleChange}>
          <option value="select-region">Select Region</option>
          <option value="display-all">View All Regions</option>
          <option value="us-east-2">us-east-2</option>
          <option value="us-east-1">us-east-1</option>
          <option value="us-west-2">us-west-2</option>
          <option value="us-west-1">us-west-1</option>
        </select>
        <button id="refresh" onClick={refresh}>Refresh</button>
      </div>
    );
  }
}

export default Menu;
