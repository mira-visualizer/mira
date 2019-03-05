const AWS_SDK_MOCK = require('aws-sdk-mock');
const AWS_SDK = require('aws-sdk');
import * as actions from "../../src/actions/actions";
import * as actionTypes from "../../src/constants/actionTypes"


// Tests for the loading function while API call is being executed
describe('actions', () => {
  // it('should register that the instance has started', () => {
  //   const payload = true
  //   const expectedAction = {
  //     type: actionTypes.GET_AWS_INSTANCES_START,
  //     payload
  //   }
  //   expect(actions.getAWSInstancesStart(payload)).toEqual(expectedAction)
  // })
  it('should register that the instance has finished', () => {
    const payload = true
    const expectedAction = {
      type: actionTypes.GET_AWS_INSTANCES_FINISHED,
      payload
    }
    expect(actions.getAWSInstancesFinished(payload)).toEqual(expectedAction)
  })
  it('should register that the instance has errored', () => {
    const payload = true
    const expectedAction = {
      type: actionTypes.GET_AWS_INSTANCES_ERROR,
      payload
    }
    expect(actions.getAWSInstancesError(payload)).toEqual(expectedAction)
  })
})


// Test for API call for clicked node details in graph to display in side panel
describe('actions', () => {
  it('should retrieve and display information related to specified node', () => {
    const payload = 'Node details'
    const expectedAction = {
      type: actionTypes.NODE_DETAILS,
      payload
    }
    expect(actions.getNodeDetails(payload)).toEqual(expectedAction)
  })
})


// Test for async API call to AWS SDK to retrieve all data for nodes
// test('retrieve all instance data for displayed nodes', () => {
//   AWS_SDK_MOCK.mock('EC2', 'describeInstances', (params, callback) => {
//     callback(null, 'Successfully retrieved instance data')
//   })
// })

// Input from Harmon for formatting async test
// describe('test', () => {
//   it('should return true', ()=> 
//   myFunction().then(param => {
//     expect(param).toEqual(true);
//   }
//   )
//   )
// })