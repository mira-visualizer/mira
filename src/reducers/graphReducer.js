import * as actionTypes from '../constants/actionTypes';

const initialState = {
    currentRegion: 'us-east-2',
    regionData: {},
    activeNode: ''
}

const graphReducer = (state = initialState, action) => {
    switch (action.type) {
      case actionTypes.GET_EC2: {
        // let regions = state.regionsData;
        // regions[state.currentRegion] = action.payload;
        return {
          ...state,
          regionData: JSON.parse(action.payload),
        }
      }

      default: return state;
    }
}

export default graphReducer;