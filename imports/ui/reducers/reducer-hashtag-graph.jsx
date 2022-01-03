import {indigo, pink} from "material-ui/colors/index";
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
  SET_TWEETS
} from "../actions/_actionTypes";

const defaultValues = {
  timestamp: 0,
  graphLayout: 'ForceLink',
  minWeightFilter: 0,
  _minWeightFilter: 0,
  nodesToHideIndex: undefined,
  oldNodesToHideIndex: undefined,
  isNodesToHideIndexUpdate: false,
  graphData: {
    nodes: [],
    edges: []
  },
  tweets: [],
  graphMetadata: {
    numberOfTweets: 0,
    numberOfNodes: 0,
    numberOfEdges: 0
  },
  topUsers: [],
  historyId: '',
  query: '',
  fwList: [],
  currentQuery: '',
  params: {
    count: "100",
    "resultType": "recent",
    "search date":" "
  },
  lastAction: '',
  selected: [],
  highlighted: [],
  hidden: [],
  showNeighborsOf: null,
  lastHidden: [],
  lastHighlighted: [],
  settings: {
    drawEdges: true,
    drawEdgeLabels: false,
    edgeColor: "default",
    defaultEdgeColor: 'rgba(144, 164, 174, 0.3)',
    clone: true,
    font: "Roboto",
    borderSize: 2,
    nodeBorderColor: 'default',
    defaultNodeBorderColor: pink['A200'],
    defaultBorderView: 'always',
    defaultNodeColor: indigo[500],
    labelThreshold: 5,
    minEdgeSize: 2,
    maxEdgeSize: 4,
    minNodeSize: 4,
    maxNodeSize: 13,
    enableEdgeHovering: true,
    edgeHoverColor: 'default',
    defaultEdgeHoverColor: pink['A200'],
    edgeHoverSizeRatio: 1,
    edgeHoverExtremities: true,
    animationsTime: 0,
    hideEdgesOnMove: true
  },
  nSettings: {}
};

export default function(state = defaultValues, action) {
  switch (action.type) {
    case GENERATE_GRAPH_DATA:
      // generate graph data from tweets
      const query = action.payload.query;
      state = {
        ...state,
        query: query,
        fwList: action.payload.fwList,
        currentQuery: query,
        params: action.payload.params,
        status: action.payload.status,
        graphData: action.payload.graphData,
        tweets: action.payload.tweets,
        graphMetadata: action.payload.graphMetadata,
        topUsers: action.payload.topUsers,
        historyId: action.payload.historyId,
        //timestamp: Date.now() / 1000 | 0,
        lastAction: action.type
      };
      break;
    case SET_TWEETS:
      if (!state.tweets || state.tweets.length != state.graphMetadata.numberOfTweets) {
        state = {
          ...state,
          tweets: action.payload
        };
      }
      break;
    case UPDATE_CURRENT_QUERY:
      state = {
        ...state,
        currentQuery: action.payload
      };
      break;
    case TOGGLE_SELECT_ALL:
      let selected = [];
      if (state.selected.length !== state.graphData.nodes.length) {
        selected = state.graphData.nodes.map(n => n.id);
      }
      state = {
        ...state,
        selected: selected
      };
      break;
    case TOGGLE_HIGHLIGHT_SELECTED:
      // Check whether all selected elements are already highlighted to tone them down
      let areHighlighted = state.selected.every((hId) => state.highlighted.includes(hId));
      let highlighted = [];
      if (areHighlighted) {
        highlighted = state.highlighted.filter((itm) => (state.selected.indexOf(itm) === -1));
      } else {
        highlighted = [...new Set([
            ...state.selected,
            ...state.highlighted
          ])];
      }
      // Merge selected array with highlighted array and remove duplicates
      state = {
        ...state,
        highlighted: highlighted,
        lastHighlighted: state.selected,
        lastAction: action.type
      };
      break;
    case TOGGLE_HIDE_SELECTED:
      // Check whether all selected elements are already hidden
      let areHidden = state.selected.every((hId) => state.hidden.includes(hId));
      let hidden = [];
      if (areHidden) {
        // if so, display them
        hidden = state.hidden.filter((itm) => (state.selected.indexOf(itm) === -1));
      } else {
        // if not, hide them all
        hidden = [...new Set([
            ...state.selected,
            ...state.hidden
          ])];
      }
      state = {
        ...state,
        hidden: hidden,
        lastHidden: state.selected,
        lastAction: action.type
      };
      break;
    case SELECT_HASHTAG:
      const selectedHashtagId = action.payload;
      const currentSelectedIndex = state.selected.indexOf(selectedHashtagId);
      const newSelected = [...state.selected];

      if (currentSelectedIndex === -1) {
        newSelected.push(selectedHashtagId);
      } else {
        newSelected.splice(currentSelectedIndex, 1);
      }
      state = {
        ...state,
        selected: newSelected,
        lastAction: action.type
      };
      break;
    case HIGHLIGHT_HASHTAG:
      const activeHashtagId = action.payload;
      const currentIndex = state.highlighted.indexOf(activeHashtagId);
      const newActive = [...state.highlighted];

      if (currentIndex === -1) {
        newActive.push(activeHashtagId);
      } else {
        newActive.splice(currentIndex, 1);
      }
      state = {
        ...state,
        highlighted: newActive,
        lastHighlighted: [activeHashtagId],
        lastAction: action.type
      };
      break;
    case SHOW_HASHTAG_NEIGHBORS:
      state = {
        ...state,
        showNeighborsOf: action.payload,
        lastAction: action.type
      };
      break;
    case HIDE_HASHTAG:
      const hiddenHashtagId = action.payload;
      const currentHiddenIndex = state.hidden.indexOf(hiddenHashtagId);
      const newHidden = [...state.hidden];

      if (currentHiddenIndex === -1) {
        newHidden.push(hiddenHashtagId);
      } else {
        newHidden.splice(currentHiddenIndex, 1);
      }
      state = {
        ...state,
        hidden: newHidden,
        lastHidden: [hiddenHashtagId],
        lastAction: action.type
      };
      break;
    case REFRESH_GRAPH:
      state = {
        ...state,
        timestamp: Date.now() / 1000 | 0,
        lastAction: "REFRESH_GRAPH"
      };
      break;
    case SET_GRAPH_LAYOUT:
      state = {
        ...state,
        graphLayout: action.payload
      };
      break;
    case SET_MIN_WEIGHT_FILTER:
      let nodesToHide = -1;
      const nodes = state.graphData.nodes;
      let nodesLen = nodes.length;
      let l = 0;
      let r = nodesLen - 1;
      let minWeight = parseInt(action.payload);

      while (l <= r) {
        i = parseInt((l + r) / 2);
        if (minWeight == nodes[i].weight) {
          break;
        } else if (minWeight > nodes[i].weight) {
          r = i - 1;
        } else {
          l = i + 1;
        }
      }
      if (l <= r) {
        let j = i - 1;
        while (j >= 0 && nodes[j].weight == minWeight) {
          j--;
        }
        nodesToHide = j;
      } else {
        while (i < nodesLen && nodes[i].weight > minWeight) {
          i++;
        }
        nodesToHide = i;
      }
      let isUpdate = false;
      if (nodesToHide != state.nodesToHideIndex) {
        isUpdate = true;
      }
      const _minWeight = action.payload;
      state = {
        ...state,
        isNodesToHideIndexUpdate: isUpdate,
        nodesToHideIndex: _minWeight == '0'
          ? undefined
          : nodesToHide,
        oldNodesToHideIndex: _minWeight == '0'
          ? undefined
          : state.nodesToHideIndex,
        minWeightFilter: _minWeight,
        lastAction: SET_MIN_WEIGHT_FILTER
      };
      break;
    case UPDATE_SETTINGS:
      // merge settings with new settings and refresh graph
      const newSettings = Object.assign(state.nSettings, action.payload);
      state = {
        ...state,
        nSettings: newSettings,
        lastAction: "UPDATE_SETTINGS",
        Stimestamp: Date.now() / 1000 | 0
      };
      break;
    case UPLOAD_FILE:
      // uploading data
      state = Object.assign(state, action.payload, {lastAction: "UPLOAD_FILE"});
      break;
    case GENERATE_STREAM_GRAPH:
      state = {
        ...state,
        ...action.payload,
        lastAction: action.type
      };
      break;
    case RESET_HASHTAG_GRAPH:
      const q = state.currentQuery;
      state = {
        ...defaultValues,
        query: q,
        currentQuery: q,
        params: {},
        lastAction: action.type
      };
      break;
  }
  return state;
}
