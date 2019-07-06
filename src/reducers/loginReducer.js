import * as actionTypes from '../constants/actionTypes';

const initialState = {
    login: false,
    awsPublicKey: '',
    awsPrivateKey: '',
}

const loginReducer = (state = initialState, action) => {
    switch(action.type){
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
        case actionTypes.LOG_IN: {
            return {
                ...state,
                login: true,
                awsPublicKey: action.payload[0],
                awsPrivateKey: action.payload[1]
            }
        }
        case actionTypes.LOG_OUT: {
            return {

            }
        }
        default: return state;
    }
}

export default loginReducer;
