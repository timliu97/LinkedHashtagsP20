import {Meteor} from "meteor/meteor";
import {
  GENERATE_GRAPH_DATA,
  GENERATE_STREAM_GRAPH,
  HIDE_HASHTAG,
  HIGHLIGHT_HASHTAG,
  REFRESH_GRAPH,
  RESET_HASHTAG_GRAPH,
  SELECT_HASHTAG,
  SET_GRAPH_LAYOUT,
  SET_MIN_WEIGHT_FILTER,
  SHOW_HASHTAG_NEIGHBORS,
  TOGGLE_HIDE_SELECTED,
  TOGGLE_HIGHLIGHT_SELECTED,
  TOGGLE_SELECT_ALL,
  UPDATE_CURRENT_QUERY,
  UPDATE_SETTINGS,
  UPLOAD_FILE,
  SET_TWEETS,
  Demo
} from "./_actionTypes";
import {
  resetEdgeData,
  toggleDemo,
  toggleImportDialog,
  toggleLoading,
  toggleParamsForm,
  toggleSnackbar,
  updateSnackbar,
  toggleHistoryDialog
} from "./UIActions";
import {generateGraphData, readUploadedFileAsText, validateData} from "../../lib/helpers";
import {resetCurrentJob} from "./JobsActions";
import {withTracker} from 'meteor/react-meteor-data';


export function setTweets(tids) {
  return async function(dispatch) {
    const tweets = await Meteor.callPromise('graphs.gettweets', tids);
    return dispatch({type: SET_TWEETS, payload: tweets});
  }
}

export function setMinWeightFilter(weight) {
  return {
    type: SET_MIN_WEIGHT_FILTER, // min weight to display
    payload: weight
  };
}

/**
 * Updates graph settings
 *
 * @param {Object} settingsToUpdate (eg. {drawEdgeLabels: true})
 * @returns {{type: string, payload: *}}
 */
export function updateSettings(settingsToUpdate) {
  return {type: UPDATE_SETTINGS, payload: settingsToUpdate};
}

export function toggleSelectAll() {
  return {type: TOGGLE_SELECT_ALL}
}

export function toggleHighlightSelected() {
  return {type: TOGGLE_HIGHLIGHT_SELECTED}
}

export function toggleHideSelected() {
  return {type: TOGGLE_HIDE_SELECTED}
}

export function selectHashtag(hashtagId) {
  return {type: SELECT_HASHTAG, payload: hashtagId}
}

export function highlightHashtag(hashtagId) {
  return {type: HIGHLIGHT_HASHTAG, payload: hashtagId}
}

export function showNeighbors(hashtagData) {
  return {type: SHOW_HASHTAG_NEIGHBORS, payload: hashtagData}
}

export function hideHashtag(hashtagId) {
  return {type: HIDE_HASHTAG, payload: hashtagId}
}

export function refreshGraph() {
console.log("refreshed");
  return {type: REFRESH_GRAPH}
}

export function setGraphLayout(layout) {
  return {type: SET_GRAPH_LAYOUT, payload: layout}
}

export function updateCurrentQuery(newQuery) {
  return {type: UPDATE_CURRENT_QUERY, payload: newQuery}
}

export function resetHashtagGraph() {
console.log("reset");
  return {type: RESET_HASHTAG_GRAPH}
}

export function restAll(){
return async function(dispatch){
dispatch(resetEdgeData());
dispatch(resetCurrentJob());
dispatch(resetHashtagGraph());
}
}
export function upload(the_voice, confinement, prayforkyoani, data){

  return async function(dispatch) {
await dispatch(resetEdgeData());
await dispatch(resetCurrentJob());
await dispatch(resetHashtagGraph());
const number = 4;
var demeName = null;
var donnee = new Array();
    const randomNumber = parseInt(Math.random()*number);
    if(randomNumber == 0){
        data = the_voice;
        demoName = "the_voice";}
    if(randomNumber == 1){
        data = confinement;
        demoName = "confinement";}
    if(randomNumber == 2){
        data = prayforkyoani;
        demoName = "prayforkyoani";}
    else{
        data = data;
        demoName = "macron";}
    donnee[0] = data;
    donnee[1] = demoName;
      dispatch(toggleImportDialog(false));
      dispatch(toggleLoading(true));

      dispatch(updateSnackbar({error: false, message: 'Importing graph...'}));
      dispatch(toggleSnackbar(true));

      // reset graph and any job residue before importing


   /* let reader = new FileReader();
  await reader.readAsText(file);
    try {
        const fileContents = await readUploadedFileAsText(file);
        dispatch(toggleLoading(false));
       const dataString = reader.result;
       const data = JSON.parse(dataString);
       */
        //Check whether file data is valid
        const isDataValid = validateData(data);
        if (isDataValid) {
          dispatch(toggleSnackbar(false));
          dispatch(updateSnackbar({error: false, message: 'Graph Imported successfully!'}));
          dispatch(toggleLoading(false));
          return dispatch({type: UPLOAD_FILE, payload: donnee});
        } else {
          dispatch(updateSnackbar({error: true, message: 'File is not valid.'}));
        }
/*
      } catch (e) {
        console.warn(e.message);
        dispatch(toggleLoading(false));
        dispatch(updateSnackbar({error: true, message: e.message}));
      }
*/
  }
}


export function uploadFile(the_voice,confinement,prayforkyoani,data) {
  return async function(dispatch) {


dispatch(resetEdgeData());
    dispatch(resetCurrentJob());
        dispatch(resetHashtagGraph());

        dispatch(resetHashtagGraph());
const number = 3;
    const randomNumber = parseInt(Math.random()*number);
    if(randomNumber == 0){
        data = the_voice;}
    if(randomNumber == 1){
        data = confinement;}
    if(randomNumber == 2){
        data = prayforkyoani;}
    else{
        data = data;}
    console.log(randomNumber);


  /*dispatch(toggleImportDialog(false));
      dispatch(toggleLoading(true));

      dispatch(updateSnackbar({error: false, message: 'Importing graph...'}));
      dispatch(toggleSnackbar(true));
    if (file.size > 0) {
      dispatch(toggleImportDialog(false));
      dispatch(toggleLoading(true));

      dispatch(updateSnackbar({error: false, message: 'Importing graph...'}));
      dispatch(toggleSnackbar(true));

      // reset graph and any job residue before importing

      let reader = new FileReader();
      await reader.readAsText(file);
      try {

        const fileContents = await readUploadedFileAsText(file);
        dispatch(toggleLoading(false));
        const dataString = reader.result;
        const data = JSON.parse(dataString);
        // Check whether file data is valid

try{

*/
  const isDataValid = validateData(data);
        if (isDataValid) {
      dispatch(toggleSnackbar(true));
          dispatch(toggleSnackbar(false));
          dispatch(updateSnackbar({error: false, message: 'Graph Imported successfully!'}));
          return dispatch({type: UPLOAD_FILE, payload: data});

        } else {
          dispatch(updateSnackbar({error: true, message: 'File is not valid.'}));
        }

/*
      } catch (e) {
        console.warn(e.message);
        dispatch(toggleLoading(false));
        dispatch(updateSnackbar({error: true, message: e.message}));
      }

*/
  }


}

export function fetchHistoryTweets(query, searchParams) {
  return async function(dispatch) {
    // close search params form when submitting a search
    dispatch(toggleParamsForm(false));
    dispatch(toggleLoading(true));
    dispatch(toggleSnackbar(true));
    dispatch(updateSnackbar({error: false, message: 'Retrieving hashtags from twitter...'}));

    // reset Hashtag Graph before loading graph
    dispatch(resetEdgeData());
    dispatch(resetCurrentJob());
    dispatch(resetHashtagGraph());

    const search = await Meteor.callPromise('tweets.fetchHistory', query, searchParams);

    const data = search.data;
    // Stop loading
    dispatch(toggleLoading(false));
    if (search.error) {
      dispatch(toggleSnackbar(false));
      dispatch(updateSnackbar({error: search.error, message: search.errorMessage.message}));
      dispatch(toggleSnackbar(true));
    } else {
      dispatch(toggleSnackbar(false));
    }
    // generate data
    return dispatch({
      type: GENERATE_GRAPH_DATA,
      payload: {
        query: search.query,
        params: search.params,
        fwList: search.fwList,
        graphData: data.graphData,
        tweets: data.tweets,
        graphMetadata: data.graphMetadata,
        topUsers: data.topUsers
      }
    });
  }
}

export function showHistory(id) {
  return async function(dispatch) {
    // close search params form when submitting a search
    dispatch(toggleHistoryDialog(false));
    dispatch(toggleParamsForm(false));
    dispatch(toggleLoading(true));
    dispatch(toggleSnackbar(true));
    dispatch(updateSnackbar({error: false, message: 'Loading history...'}));

    // reset Hashtag Graph before loading graph
    dispatch(resetEdgeData());
    dispatch(resetCurrentJob());
    dispatch(resetHashtagGraph());

    const search = await Meteor.callPromise('tweets.getHistory', id);
    const data = search.data;
    // Stop loading
    dispatch(toggleLoading(false));
    if (search.error) {
      dispatch(toggleSnackbar(false));
      dispatch(updateSnackbar({error: search.error, message: search.errorMessage.message}));
      dispatch(toggleSnackbar(true));
    } else {
      dispatch(toggleSnackbar(false));
    }
    // generate data
    return dispatch({
      type: GENERATE_GRAPH_DATA,
      payload: {
        historyId: id,
        query: search.query,
        params: search.params,
        fwList: search.fwList,
        graphData: data.graphData,
        tweets: data.tweets,
        graphMetadata: data.graphMetadata,
        topUsers: data.topUsers
      }
    });
  }
}

export function generateStreamGraph(graph) {
  // reset graph but only those which will be updated?

  return {
    type: GENERATE_STREAM_GRAPH,
    payload: {
      graphData: graph.graphData,
      tweets: graph.tweets,
      graphMetadata: graph.graphMetadata,
      topUsers: graph.topUsers,
      timestamp: Date.now() / 1000 | 0
    }
  }
}