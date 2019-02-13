import * as actionTypes from '../constants/actionTypes';

const initialState = {
    ec2Instances: [],
    rdsInstances: [],
    s3Instances: []
}

const graphReducer = (state = initialState, action) => {
    switch (action.type) {
      case actionTypes.GET_EC2: {
        console.log('this is the state: ',state);
        return {
          ...state,
          // what we will be updating?
          ec2Instances: action.payload,
        }
      }

      default: return state;
    }
}

export default graphReducer;