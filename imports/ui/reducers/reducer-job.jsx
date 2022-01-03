import {CREATE_JOB, RESET_CURRENT_JOB, SET_CURRENT_JOB, SET_STREAM_JOB_ID} from '../actions/_actionTypes';

const defaultState = {
  lastCreatedJob: null,
  streamJobId: null,
  currentJob: null
};

export default function(state = defaultState, action) {
  switch (action.type) {
    case CREATE_JOB:
      state = {
        ...state,
        lastCreatedJob: action.payload
      };
      break;
    case SET_STREAM_JOB_ID:
      state = {
        ...state,
        streamJobId: action.payload
      };
      break;
    case SET_CURRENT_JOB:
      state = {
        ...state,
        currentJob: action.payload
      };
      break;
    case RESET_CURRENT_JOB:
      state = {
        ...state,
        streamJobId: null,
        currentJob: null
      };
      break;
  }
  return state;
}
