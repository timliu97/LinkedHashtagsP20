import {GENERATE_GRAPH_DATA} from "../actions/_actionTypes";

const defaultValues = {
  timestamp: 0,
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
  query: '',
  currentQuery: '',
  params: {
    count: "100"
  }
};

export default function(state = defaultValues, action) {
  switch (action.type) {
    case GENERATE_GRAPH_DATA:
      // generate graph data from tweets
      const query = action.payload.query;
      state = {
        ...state,
        query: query,
        currentQuery: query,
        params: action.payload.params,
        status: action.payload.status,
        graphData: action.payload.graphData,
        tweets: action.payload.tweets,
        graphMetadata: action.payload.graphMetadata,
        timestamp: Date.now() / 1000 | 0
      };
      break;
  }
  return state;
}
