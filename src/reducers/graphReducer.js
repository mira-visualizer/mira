import * as actionTypes from '../constants/actionTypes';

const initialState = {
    currentRegion: '',
    regionData: {},
    activeNode: ''
}

// should possibly rename this reducer
const graphReducer = (state = initialState, action) => {
    switch (action.type) {
      case actionTypes.GET_AWS_INSTANCES: {
        return {
          ...state,
          regionData: JSON.parse(action.payload.regionState),
          currentRegion: action.payload.currentRegion
        }
      }
      case actionTypes.NODE_DETAILS: {
        const newState = {...state, activeNode:action.payload}
        return newState;
      }
      default: return state;
    }
}

export default graphReducer;