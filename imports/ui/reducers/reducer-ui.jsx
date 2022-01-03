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
  UPLOAD_FILE,
  Demo,
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
} from '../actions/_actionTypes';
import {Meteor} from "meteor/meteor";

const defaultFile = {
  name: 'Choose a file...',
  size: 0
};

const defaultEdgeData = {
  source: 0,
  target: 0,
  tweets: [],
  weight: 0
};

export default function(state = {
  streamingOn: false,
  accountFormDialogOpen: false,
  isSignInForm: true,
  exportDialogOpen: false,
  importDialogOpen: false,
  file: defaultFile,
  paramsFormOpen: false,
  sidebarOpen: true,
  sortHLAnchorEl: null,
  streamDialogOpen: false,
  historyDialogOpen: false,
  snackbarOpen: false,
  snackbar: {
    error: false,
    message: 'Search hashtags to load graph!',
    anchorOrigin: {
      vertical: 'bottom',
      horizontal: 'right'
    }
  },
  loading: false,
  nodeActions: {
    open: false,
    nodeData: {},
    nodePosition: {}
  },
  showEdgeDataCard: false,
  showEventDataCard: false,
  edgeData: defaultEdgeData,
  sortHashtagList: {
    by: null,
    direction: null
  },
  toolbarOpen: false,
  isFullscreen: false,
  graphParamsAnchorEl: null,
  graphFiltersAnchorEl: null,
  infoDialogOpen: false,
  upgradeOpen: false,
  usersDialogOpen: false,

  isFuzzy: false,
  eventQuery: false,
  tweetChecked: {},
  tweetCheckedCount: {},
  openedEventCards: {},

  level1Count: 10,
  level2Count: 20,
  viewCheckedTweet: false,

  istoggleHeatmap: false,
  HeatmapMode: 0,

  isDashboardMode: false
}, action) {
  switch (action.type) {
    case RESET_GRAPH_CAMERA:
      if (window._sigma) {
        const camera = window._sigma.camera;
        camera.x = 0;
        camera.y = 0;
        camera.ratio = 1;
        window._sigma.refresh({skipIndexation: true})
      }
      break;
    case CHANGE_IS_DASHBORD_MODE:
      state = {
        ...state,
        isDashboardMode: action.payload
      }
      break;
    case CHANGE_IS_FUZZY:
      state = {
        ...state,
        isFuzzy: action.payload
      };
      break;
    case CHANGE_HEATMAP_MODE:
      state = {
        ...state,
        HeatmapMode: action.payload
      };
      break;
    case TOGGLE_HEATMAP:
      state = {
        ...state,
        istoggleHeatmap: action.payload
      };
      break;
    case SET_LEVEL1_COUNT:
      state = {
        ...state,
        level1Count: action.payload
      };
      break;
    case SET_LEVEL2_COUNT:
      state = {
        ...state,
        level2Count: action.payload
      };
      break;
    case CHANGE_VIEW_TWEET:
      state = {
        ...state,
        viewCheckedTweet: action.payload
      };
      break;
    case RESET_EVENT_STORE:
      state = {
        ...state,
        tweetChecked: {},
        tweetCheckedCount: {},
        openedEventCards: {}
      };
      break;
    case TWEET_CHCKED:
      let tc = {
        ...state.tweetChecked
      };
      let tcc = {
        ...state.tweetCheckedCount
      };
      if (!tc[action.payload.tdiv_id]) 
        tc[action.payload.tdiv_id] = {};
      tc[action.payload.tdiv_id][action.payload.tid] = true;
      if (!tcc[action.payload.tdiv_id]) {
        tcc[action.payload.tdiv_id] = 1;
      } else {
        ++tcc[action.payload.tdiv_id];
      }
      Meteor.callPromise("graphs.checkTweet", action.payload.id, tc, tcc);

      state = {
        ...state,
        tweetChecked: tc,
        tweetCheckedCount: tcc
      };
      break;
    case CHANGE_TWEET_EVENT_CARD:
      let oec = {
        ...state.openedEventCards
      };
      oec[action.payload.tdiv_id] = action.payload.state;
      state = {
        ...state,
        openedEventCards: oec
      };
      break;
    case SET_EVENT_HASHTAG_LIST:
      state = {
        ...state,
        eventHashtagList: action.payload.list,
        eventQuery: action.payload.query
      };
      break;
    case TOGGLE_EVENT_DATA:
      if (action.payload.isOpen) {
        const s = action.payload.status;
        if (s) {
          state = {
            ...state,
            showEventDataCard: action.payload.isOpen,
            eventHashtagList: s.hList,
            eventQuery: s.query,
            isFuzzy: s.isFuzzy,
            tweetChecked: s.tweetChecked,
            tweetCheckedCount: s.tweetCheckedCount
          };
        } else {
          state = {
            ...state,
            showEventDataCard: action.payload.isOpen
          };
        }
      } else {
        state = {
          ...state,
          showEventDataCard: action.payload.isOpen
        };
      }
      break;
    case TOGGLE_STREAMING:
      state = {
        ...state,
        streamingOn: action.payload
      };
      break;
    case TOGGLE_ACCOUNT_FORM_DIALOG:
      state = {
        ...state,
        accountFormDialogOpen: action.payload
      };
      break;
    case SWITCH_ACCOUNT_FORM:
      state = {
        ...state,
        isSignInForm: !state.isSignInForm
      };
      break;
    case TOGGLE_EXPORT_DIALOG:
      state = {
        ...state,
        exportDialogOpen: action.payload
      };
      break;
    case TOGGLE_SNACKBAR:
      state = {
        ...state,
        snackbarOpen: action.payload
      };
      break;
    case UPDATE_SNACKBAR:
      state = {
        ...state,
        snackbar: Object.assign(state.snackbar, action.payload)
      };
      break;
    case TOGGLE_LOADING:
      state = {
        ...state,
        loading: action.payload
      };
      break;
    case TOGGLE_NODE_ACTIONS:
      state = {
        ...state,
        nodeActions: action.payload
      };
      break;
    case TOGGLE_EDGE_DATA_CARD:
      state = {
        ...state,
        showEdgeDataCard: action.payload
      };
      break;
    case SET_EDGE_DATA:
      state = {
        ...state,
        edgeData: action.payload
      };
      break;
    case RESET_EDGE_DATA:
      state = {
        ...state,
        showEdgeDataCard: false,
        edgeData: defaultEdgeData
      };
      break;
    case TOGGLE_SORT_HL:
      state = {
        ...state,
        sortHLAnchorEl: action.payload
      };
      break;
    case SORT_HASHTAG_LIST:
      state = {
        ...state,
        sortHashtagList: action.payload
      };
      break;
    case TOGGLE_IMPORT_DIALOG:
      state = {
        ...state,
        importDialogOpen: action.payload,
        file: defaultFile
      };
      break;
      case TOGGLE_UPGRADE:
        state = {
        ...state,
        upgradeOpen: action.payload,
        };
        break;
    case CHOOSE_FILE:
      state = {
        ...state,
        file: action.payload
      };
      break;
    case UPLOAD_FILE:
      // close import dialog and reset file
      state = {
        ...state,
        importDialogOpen: false,
        file: defaultFile,
        Demo: action.payload
      };
      break;
    case TOGGLE_PARAMS_FORM:
      state = {
        ...state,
        paramsFormOpen: action.payload
      };
      break;
    case TOGGLE_SIDEBAR:
      state = {
        ...state,
        sidebarOpen: action.payload
      };
      break;
    case TOGGLE_STREAM_DIALOG:
      state = {
        ...state,
        streamDialogOpen: action.payload
      };
      break;
    case TOGGLE_HISTORY_DIALOG:
      state = {
        ...state,
        historyDialogOpen: action.payload
      };
      break;
    case TOGGLE_TOOLBAR:
      state = {
        ...state,
        toolbarOpen: action.payload
      };
      break;
    case TOGGLE_GRAPH_PARAMS:
      state = {
        ...state,
        graphParamsAnchorEl: action.payload
      };
      break;
    case TOGGLE_GRAPH_FILTERS:
      state = {
        ...state,
        graphFiltersAnchorEl: action.payload
      };
      break;
    case TOGGLE_FULLSCREEN:
      state = {
        ...state,
        isFullscreen: action.payload
      };
      break;
    case TOGGLE_INFO_DIALOG:
      state = {
        ...state,
        infoDialogOpen: action.payload
      };
      break;
    case TOGGLE_USERS_DIALOG:
      state = {
        ...state,
        usersDialogOpen: action.payload
      };
      break;
    case TOGGLE_ANALYTICS_PANEL:
      state = {
        ...state,
        isToggleAnalyticsPanel: action.payload
      };
  }
  return state;
}
