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
    awsPublicKey: '',
    awsPrivateKey: '',
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
      //separate login into a new reducer file.
      //sets state with the credentials found on folder
      //encrypt on folder decrypt on set redux state
      case actionTypes.GET_AWS_KEYS: {
        return {
          ...state,
          awsPublicKey: action.payload[0],
          awsPrivateKey: action.payload[1]
        }
      }
      case actionTypes.GET_AWS_INSTANCES: {
        return {
          ...state,
          regionData: action.payload.regionState,
          currentRegion: action.payload.currentRegion,
          edgeTable: action.payload.edgeTable,
          activeNode: {}
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
        return {
          ...state,
          allRegions: action.payload.result
        }
      }
      default: return state;
    }
}

export default graphReducer;