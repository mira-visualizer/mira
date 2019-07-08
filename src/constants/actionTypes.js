// boilerplate template - needs to be updated with more suitable actionTypes

export const GET_AWS_INSTANCES = 'GET_AWS_INSTANCES';
export const NODE_DETAILS = 'NODE_DETAILS';
export const GET_AWS_INSTANCES_START = 'GET_AWS_INSTANCES_START';
export const GET_AWS_INSTANCES_FINISHED ='GET_AWS_INSTANCES_FINISHED';
export const GET_AWS_INSTANCES_ERROR = 'GET_AWS_INSTANCES_ERROR';
export const GET_ALL_REGIONS = 'GET_ALL_REGIONS';
export const GET_AWS_KEYS = 'GET_AWS_KEYS'; //when main container mounts after login
export const LOG_IN = 'LOG_IN'; // should change login state to true and create AWS folder
export const LOG_OUT = 'LOG_OUT'; // should delete IAM on AWS, delete folder .aws and change login state to false