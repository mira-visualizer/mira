import * as actionTypes from '../constants/actionTypes';

const initialState = {
    currentRegion: '',
    regionData: {},
    edgeTable:{},
    // sgNodeCorrelations: {},
    // sgRelationships: [],
    activeNode: '',
    fetching: false,
    fetched: false,
    allRegions: {},
}

// should possibly rename this reducer
const graphReducer = (state = initialState, action) => {
    switch (action.type) {
      case actionTypes.GET_AWS_INSTANCES_START:{
        return {
          ...state,
          fetching:true,
          fetched: false
        }
      }
      case actionTypes.GET_AWS_INSTANCES_FINISHED:{
        return {
          ...state,
          fetching:false,
          fetched: true
        }
      }
      case actionTypes.GET_AWS_INSTANCES: {
        return {
          ...state,
          regionData: action.payload.regionState,
          currentRegion: action.payload.currentRegion,
          edgeTable: action.payload.edgeTable
          // sgNodeCorrelations: action.payload.sgNodeCorrelations,
          // sgRelationships: action.payload.sgRelationships
        }
      }
      case actionTypes.NODE_DETAILS: {
        const VPC = action.payload[3];
        const availabilityZone = action.payload[2];
        const instanceType = action.payload[1];
        const instanceId = action.payload[0];
        const nodeData = state.regionData[VPC][availabilityZone][instanceType][instanceId];
        return {
          ...state,
          activeNode: nodeData
        }
      }
      case actionTypes.GET_ALL_REGIONS: {
        console.log('All regions data being saved', action.payload.result)
        return {
          ...state,
          allRegions: action.payload.result
        }
      }
      default: return state;
    }
}

export default graphReducer;