import graphReducer from '../../src/reducers/graphReducer';
import * as actionTypes from '../../src/constants/actionTypes';

describe('graphReducer', () => {
  let state;
  beforeEach(() => {
    state = {
      currentRegion: '',
      regionData: {},
      activeNode: '',
      fetching: false,
      fetched: false,
    }
  })
  describe('defaultState', () => {
    it('should return a default state when given an undefined input', () => {
      expect(graphReducer(undefined, {type: undefined})).toEqual(state)
    })
  })
  describe('getAWSInstancesLoadingGif', () => {
    it('should return updated state reflecting result of GET_AWS_INSTANCES_START action', () => {
      expect(graphReducer(state, {type: actionTypes.GET_AWS_INSTANCES_START})).toEqual({...state, fetching: true, fetched: false})
    })
    it('should return updated state reflecting result of GET_AWS_INSTANCES_FINISHED action', () => {
      expect(graphReducer(state, {type: actionTypes.GET_AWS_INSTANCES_FINISHED})).toEqual({...state, fetching: false, fetched: true})
    })
  })
})
