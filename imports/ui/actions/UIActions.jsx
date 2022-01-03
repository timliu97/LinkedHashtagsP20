import {Meteor} from "meteor/meteor";
import {
  CHOOSE_FILE,
  RESET_EDGE_DATA,
  SET_EDGE_DATA,
  SORT_HASHTAG_LIST,
  SWITCH_ACCOUNT_FORM,
  TOGGLE_ACCOUNT_FORM_DIALOG,
  TOGGLE_EDGE_DATA_CARD,
  TOGGLE_EXPORT_DIALOG,
  TOGGLE_FULLSCREEN,
  TOGGLE_DEMO,
  TOGGLE_GRAPH_FILTERS,
  TOGGLE_GRAPH_PARAMS,
  TOGGLE_IMPORT_DIALOG,
  TOGGLE_UPGRADE,
  TOGGLE_INFO_DIALOG,
  TOGGLE_LOADING,
  TOGGLE_NODE_ACTIONS,
  TOGGLE_PARAMS_FORM,
  TOGGLE_SIDEBAR,
  TOGGLE_SNACKBAR,
  TOGGLE_SORT_HL,
  TOGGLE_STREAM_DIALOG,
  TOGGLE_HISTORY_DIALOG,
  TOGGLE_STREAMING,
  TOGGLE_TOOLBAR,
  TOGGLE_USERS_DIALOG,
  UPDATE_SNACKBAR,
  TOGGLE_ANALYTICS_PANEL,
  RESET_GRAPH_CAMERA,
  TOGGLE_EVENT_DATA,
  SET_EVENT_HASHTAG_LIST,
  TWEET_CHCKED,
  CHANGE_TWEET_EVENT_CARD,
  RESET_EVENT_STORE,
  SET_LEVEL1_COUNT,
  SET_LEVEL2_COUNT,
  CHANGE_VIEW_TWEET,
  TOGGLE_HEATMAP,
  CHANGE_HEATMAP_MODE,
  CHANGE_IS_FUZZY,
  CHANGE_IS_DASHBORD_MODE
} from './_actionTypes';

export function changeIsDashboard_Mode(isDashboardMode) {
  return {type: CHANGE_IS_DASHBORD_MODE, payload: isDashboardMode}
}

export function changeIsFuzzy(isFuzzy) {
  return {type: CHANGE_IS_FUZZY, payload: isFuzzy}
}

export function toggleHeatmap(istoggleHeatmap) {
  return {type: TOGGLE_HEATMAP, payload: istoggleHeatmap}
}

export function changeHeatmapMode(mode) {
  return {type: CHANGE_HEATMAP_MODE, payload: mode}
}

export function setLevel1Count(count) {
  return {type: SET_LEVEL1_COUNT, payload: count}
}

export function setLevel2Count(count) {
  return {type: SET_LEVEL2_COUNT, payload: count}
}

export function changeViewTweet(isViewChecked) {
  return {type: CHANGE_VIEW_TWEET, payload: isViewChecked}
}

export function resetEvent() {
  return {type: RESET_EVENT_STORE, payload: null}
}

export function checkTweet(id, tdiv_id, tid) {
  return {
    type: TWEET_CHCKED,
    payload: {
      id: id,
      tdiv_id: tdiv_id,
      tid: tid
    }
  };
}

export function changeTweetEventCard(tdiv_id, state) {
  return {
    type: CHANGE_TWEET_EVENT_CARD,
    payload: {
      tdiv_id: tdiv_id,
      state: state
    }
  };
}

export function setEventHashtagList(query) {
  query = query.toLowerCase().replace(/ /g, '');
  let fwLists = [];
  let querys = [query];
  if (query.search(/;/) != -1) {
    querys = query.split(';');
  }

  let lenQuerys = querys.length;
  let i = 0;
  for (i = 0; i < lenQuerys; i++) {
    let q = querys[i];
    if (q.search(/\|/) != -1) {
      const hf = q.split('|');
      let fwList = [
        hf[0].split(','),
        hf[1].split(',')
      ];
      fwLists.push(fwList);
    } else {
      let fwList = [q.split(','), []];
      fwLists.push(fwList);
    }
  }

  if (fwLists.length != 0) {
    return {
      type: SET_EVENT_HASHTAG_LIST,
      payload: {
        list: fwLists,
        query: query
      }
    }
  }
};

export function toggleEventDataCard(open, id) {
  return async function(dispatch) {
    let status = {}
    if (open) {
      status = await Meteor.callPromise("graphs.getEventStatus", id);
    }
    return dispatch({
      type: TOGGLE_EVENT_DATA,
      payload: {
        isOpen: open,
        status: status
      }
    })
  }
};

export function toggleAnalyticsPanel(open) {
  return {type: TOGGLE_ANALYTICS_PANEL, payload: open};
}

export function toggleStreaming(on) {
  return {type: TOGGLE_STREAMING, payload: on};
}

export function toggleAccountForm(open) {
  return {type: TOGGLE_ACCOUNT_FORM_DIALOG, payload: open};
}

export function switchAccountForm() {
  return {type: SWITCH_ACCOUNT_FORM}
}

export function toggleExportDialog(open) {
  return {type: TOGGLE_EXPORT_DIALOG, payload: open};
}

export function toggleNodeActions(open, nodeData = null, captor = null) {
  let nodePosition = {};
  if (captor) {
    nodePosition = {
      top: captor['clientY'],
      left: captor['clientX']
    };
  }
  return {
    type: TOGGLE_NODE_ACTIONS,
    payload: {
      open: open,
      nodeData: nodeData,
      nodePosition: nodePosition
    }
  };
}

export function setEdgeData(edgeData) {
  return {type: SET_EDGE_DATA, payload: edgeData}
}

export function resetEdgeData() {
  return {type: RESET_EDGE_DATA}
}

export function toggleEdgeDataCard(show) {
  return {type: TOGGLE_EDGE_DATA_CARD, payload: show}
}

export function sortHashtagList(by, direction) {
  return async function(dispatch) {
    return dispatch({
      type: SORT_HASHTAG_LIST,
      payload: {
        by: by,
        direction: direction
      }
    })
  }
}

export function toggleSortHL(target = null) {
  return {type: TOGGLE_SORT_HL, payload: target}
}

export function toggleSnackbar(data) {
  return {type: TOGGLE_SNACKBAR, payload: data}
}

export function updateSnackbar(data) {
  return {type: UPDATE_SNACKBAR, payload: data}
}

export function toggleLoading(isLoading) {
  return {type: TOGGLE_LOADING, payload: isLoading}
}

export function toggleImportDialog(open) {
  return {type: TOGGLE_IMPORT_DIALOG, payload: open};
}

export function toggleDemo(open){
return {type: TOGGLE_DEMO, payload:open};
}
export function toggleUpgrade(open) {
    return {type: TOGGLE_UPGRADE, payload: open};
}

export function toggleUsersDialog(open) {
  return {type: TOGGLE_USERS_DIALOG, payload: open};
}

export function chooseFile(file) {
  if (!file) {
    file = {
      name: 'Choose a file...',
      size: 0
    };
  }
  return {type: CHOOSE_FILE, payload: file}

}

export function toggleParamsForm(open) {

  return {type: TOGGLE_PARAMS_FORM, payload: open};
}

export function toggleSidebar(open) {
  return {type: TOGGLE_SIDEBAR, payload: open};
}

export function toggleStreamDialog(open) {
  return {type: TOGGLE_STREAM_DIALOG, payload: open};
}

export function toggleHistoryDialog(open) {
  return {type: TOGGLE_HISTORY_DIALOG, payload: open};
}

export function toggleToolbar(open) {
  return {type: TOGGLE_TOOLBAR, payload: open};
}

export function toggleGraphParams(target = null) {
  return {type: TOGGLE_GRAPH_PARAMS, payload: target};
}

export function toggleGraphFilters(target = null) {
  return {type: TOGGLE_GRAPH_FILTERS, payload: target};
}

export function toggleFullscreen(fullscreen) {
  return {type: TOGGLE_FULLSCREEN, payload: fullscreen};
}

export function toggleInfoDialog(open) {
  return {type: TOGGLE_INFO_DIALOG, payload: open};
}

export function resetGraphCamera() {
  return {type: RESET_GRAPH_CAMERA}
}
