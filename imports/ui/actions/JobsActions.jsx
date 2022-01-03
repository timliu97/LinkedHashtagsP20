import {CONTROL_JOB, CREATE_JOB, RESET_CURRENT_JOB, SET_CURRENT_JOB, SET_STREAM_JOB_ID} from "./_actionTypes";
import {resetEdgeData, toggleParamsForm, toggleStreamDialog, resetEvent} from "./UIActions";
import {resetHashtagGraph} from "./HashtagGraphActions";

export function createJob(type, data) {
  return async function(dispatch) {
    // reset Hashtag Graph before setting Stream JobID
    dispatch(resetEdgeData());
    dispatch(resetCurrentJob());
    dispatch(resetHashtagGraph());
    dispatch(resetEvent());

    // close params form
    dispatch(toggleParamsForm(false));

    const jobId = await Meteor.callPromise('jobs.create', type, data);

    // set graphData
    // set job tracking ID
    dispatch({type: SET_STREAM_JOB_ID, payload: jobId});

    // show snackbar? 'job created' will be running in ...

    return dispatch({type: CREATE_JOB, payload: jobId});
  }
}

export function controlJob(_id, action) {
  let job = Meteor.call('jobs.control', _id, action);
  return {type: CONTROL_JOB, payload: job};
}

export function deleteHistory(_id) {
  Meteor.call('tweets.deleteHistory', _id);
  return {type: CONTROL_JOB, payload: true};
}

export function setStreamJobId(id) {
  return async function(dispatch) {
    dispatch(resetEdgeData());
    dispatch(resetCurrentJob());
    dispatch(resetHashtagGraph());
    dispatch(resetEvent());

    return dispatch({type: SET_STREAM_JOB_ID, payload: id});
  }
}

export function setCurrentJob(status) {
  return async function(dispatch) {
    // close stream dialog
    dispatch(toggleStreamDialog(false));

    // close params form
    dispatch(toggleParamsForm(false));

    return dispatch({type: SET_CURRENT_JOB, payload: status});
  }
}

export function resetCurrentJob() {
  return {type: RESET_CURRENT_JOB}
}
