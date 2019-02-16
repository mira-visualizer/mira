import * as actionTypes from '../constants/actionTypes';

const initialState = {
    currentRegion: 'us-east-2',
    regionData: {},
    activeNode: ''
}

// should possibly rename this reducer
const graphReducer = (state = initialState, action) => {
    switch (action.type) {
      case actionTypes.GET_AWS_INSTANCES: {
        return {
          ...state,
          regionData: JSON.parse(action.payload),
        }
      }
      case actionTypes.NODE_DETAILS: {
        const VPC = action.payload[3];
        const availabilityZone = action.payload[2];
        const instanceType = action.payload[1];
        const instanceId = action.payload[0];
        const nodeData = state.regionData[state.currentRegion][VPC][availabilityZone][instanceType][instanceId];
        return {
          ...state,
          activeNode: nodeData
        }
      }
      default: return state;
    }
}

export default graphReducer;