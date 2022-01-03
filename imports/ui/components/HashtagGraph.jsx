import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {bindActionCreators, compose} from 'redux';
import {connect} from 'react-redux';
import {indigo, pink} from 'material-ui/colors';
import {embedProps} from 'react-sigma/lib/tools';
import {hideHashtag, highlightHashtag, refreshGraph} from "../actions/HashtagGraphActions";
import {setEdgeData, toggleEdgeDataCard, toggleNodeActions} from "../actions/UIActions";
import {generateStreamGraph, setTweets} from "../actions/HashtagGraphActions";
import {myJobs} from '../../api/jobs';
import {setCurrentJob} from "../actions/JobsActions";
import {withTracker} from 'meteor/react-meteor-data';
import {Graphs} from '../../api/graphs';

class HashtagGraph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false
    };
    this.props.sigma.bind("rightClickNode", (e) => this.onRightClickNode(e));
    this.props.sigma.bind("clickEdge", (e) => this.onClickEdge(e));

    window._sigma = this.props.sigma;

    let first = this.props.sigma.graph.nodes(0)
    if (first) {
      this.originalColor = first.color;
    }
    this.sts = null;
  }

  onRightClickNode(e) {
    const nodeData = e.data.node;
    const captor = e.data.captor;
    // show node actions menu
    this.props.toggleNodeActions(true, nodeData, captor);
  }

  onClickEdge(e) {
    const edgeData = e.data.edge;
    // display edgeData on graph sidebar
    if (this.props.job) 
      this.props.setTweets(edgeData.tweets);
    this.props.toggleEdgeDataCard(true);
    this.props.setEdgeData(edgeData);
  }

  highlightNode(hashtagKeys) {
    let i = 0;
    let graph = this.props.sigma.graph;
    const highlighted = this.props.highlightedHashtags
    for (i; i < hashtagKeys.length; i++) {
      let id = hashtagKeys[i];
      let node = graph.nodes(id);
      if (highlighted.indexOf(id) === -1) {
        node.color = this.originalColor;
      } else {
        node.color = pink['A200'];
        node.borderWidth = 2;
        node.borderColor = indigo[50];
      }
    }
    this.props.sigma.refresh({skipIndexation: true});
  }

  hideNode(hashtagKeys) {
    let i = 0;
    let graph = this.props.sigma.graph;
    for (i; i < hashtagKeys.length; i++) {
      let id = hashtagKeys[i];
      let node = graph.nodes(id);
      node.hidden = this.props.hiddenHashtags.indexOf(id) !== -1;
    }
    this.props.sigma.refresh({skipIndexation: true});
  }

  hideManyNodeSince() {
    const hidden_m = this.props.hiddenHashtags;
    const position = this.props.nodesToHideIndex;
    const oldPosition = this.props.oldNodesToHideIndex;
    const graph = this.props.graph;
    const nodes = graph.nodes;
    const nodesLen = nodes.length;
    const sigma = this.props.sigma.graph;
    let untilPosition = nodesLen;
    let i = 0;

    if ((oldPosition && position > oldPosition) || (!oldPosition && !position)) {
      oldPosition = oldPosition
        ? oldPosition
        : 0;
      position = position
        ? position
        : nodesLen - 1;

      for (i = oldPosition; i < position + 1; i++) {
        try {
          if (!hidden_m.find((x) => x == nodes[i].id)) {
            sigma.nodes(nodes[i].id).hidden = false;
          }
        } catch (e) {
          console.log(e);
        }
      }
    }

    if (oldPosition && position < oldPosition) {
      untilPosition = oldPosition + 1;
    }

    for (i = position + 1; i < untilPosition; i++) {
      try {
        sigma.nodes(nodes[i].id).hidden = true;
      } catch (e) {
        console.log(e);
      }
    }
    this.props.sigma.refresh({skipIndexation: true});
  }

  componentWillReceiveProps(nextProps) {
    // if new graph is different from current graph, reload graph
    const {generateStreamGraph, setCurrentJob, settingTimestamp, graphSettings} = this.props;
    const _sigma = this.props.sigma;

    if (nextProps.graphExists && nextProps.update_graph) {
      generateStreamGraph(nextProps.s_graph);
    }
    if (nextProps.jobExists && nextProps.update_job) {
      setCurrentJob(nextProps.job);
    }

    const _graph = _sigma.graph;

    if (nextProps.lastAction == 'RESET_HASHTAG_GRAPH' && _graph.nodes().length !== 0) {
      _graph.clear();
    }

    if (nextProps.graph !== this.props.graph) {
      this.setState({loaded: false});
      this._load(nextProps.graph)
    }
  }

  _load(graph) {
    if (graph && graph.nodes.length != 0 && this.props.sigma) {

      const _graph = this.props.sigma.graph;
      if (_graph && _graph.nodes() && _graph.nodes().length == 0) {
        _graph.clear();
        _graph.read(graph);
        this.props.sigma.refresh();
      } else {
        const nodes = graph.nodes;
        const edges = graph.edges;
        const n_nodes = nodes.length;
        const n_edges = edges.length;

        for (i = 0; i < n_nodes; i++) {
          let fnode = _graph.nodes(nodes[i].id);
          if (!fnode) {
            _graph.addNode(nodes[i]);
          } else {
            fnode.size = nodes[i].size;
            fnode.weight = nodes[i].weight;
          }
        }

        for (i = 0; i < n_edges; i++) {
          let fedge = _graph.edges(edges[i].id);
          if (!fedge) {
            _graph.addEdge(edges[i]);
          } else {
            fedge.size = edges[i].size;
            fedge.weight = edges[i].weight;
            fedge.label = edges[i].label;
            fedge.tweets = edges[i].tweets;
          }
        }
      }
      this.setState({loaded: true});
    }
  }

  componentDidMount() {
    this._load(this.props.graph);
  }

  componentDidUpdate() {
    const _sigma = this.props.sigma;
    switch (this.props.lastAction) {
      case 'RESET_HASHTAG_GRAPH':
        const _graph = _sigma.graph;
        if (_sigma) {
          _graph.clear();
          try {
            _sigma.refresh();
          } catch (e) {};
        }
        break;
      case "HIDE_HASHTAG":
        this.hideNode(this.props.lastHidden);
        break;
      case "TOGGLE_HIDE_SELECTED":
        this.hideNode(this.props.lastHidden);
        break;
      case 'UPDATE_SETTINGS':
        const st = this.props.nSettings;
        if (_sigma) {
          Object.keys(st).forEach(function(e) {
            _sigma.settings(e, st[e]);
          });
          _sigma.refresh({skipIndexation: true});
        }
        break;
      case 'HIGHLIGHT_HASHTAG':
      case 'TOGGLE_HIGHLIGHT_SELECTED':
        this.highlightNode(this.props.lastHighlighted);
        break;
      case 'SHOW_HASHTAG_NEIGHBORS':
        this.showNeighbors(this.props.showNeighborsOf);
        break;
      case 'UPLOAD_FILE':
      case 'UPDATE_SETTINGS':
      case 'REFRESH_GRAPH':
        break;
      case 'SET_MIN_WEIGHT_FILTER':
        if (this.props.isNodesToHideIndexUpdate) {
          this.hideManyNodeSince();
        }
        break;
    }
  }

  render() {
    if (!this.state.loaded) 
      return null;
    return <div>{embedProps(this.props.children, {sigma: this.props.sigma})}</div>;
  }
}

function mapStateToProps(state) {
  return {
    highlightedHashtags: state.hashtagGraph.highlighted,
    hiddenHashtags: state.hashtagGraph.hidden,
    lastHighlighted: state.hashtagGraph.lastHighlighted,
    lastHidden: state.hashtagGraph.lastHidden,
    lastAction: state.hashtagGraph.lastAction,
    nodesToHideIndex: state.hashtagGraph.nodesToHideIndex,
    oldNodesToHideIndex: state.hashtagGraph.oldNodesToHideIndex,
    isNodesToHideIndexUpdate: state.hashtagGraph.isNodesToHideIndexUpdate,
    nSettings: state.hashtagGraph.nSettings,
    Stimestamp: state.hashtagGraph.Stimestamp
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    highlightHashtag: highlightHashtag,
    hideHashtag: hideHashtag,
    toggleNodeActions: toggleNodeActions,
    toggleEdgeDataCard: toggleEdgeDataCard,
    setEdgeData: setEdgeData,
    refreshGraph: refreshGraph,
    generateStreamGraph: generateStreamGraph,
    setCurrentJob: setCurrentJob,
    setTweets: setTweets
  }, dispatch)
}

export default compose(withTracker(({id}) => {
  if (id) {
    // check status of job

    const jobsHandle = Meteor.subscribe('allJobs', id);
    const graphsHandle = Meteor.subscribe('graphs', id);

    let loadingJob = !jobsHandle.ready();
    let loading = !graphsHandle.ready();

    const job = myJobs.findOne(id);
    const jobExists = !!job;

    const graph = Graphs.findOne(id);
    const graphExists = !!graph;

    let update_graph = true;
    let update_job = true;

    if (graphExists) {
      update_graph = (this.t_count && this.t_count == graph.graphMetadata.numberOfTweets)
        ? false
        : true;
      if (this.old_job_id != id) 
        update_graph = true;
      this.t_count = graph.graphMetadata.numberOfTweets
    }

    let currentJob;
    if (jobExists) {
      update_job = (this.old_job_id && this.old_job_id == id && this.old_job_status == job.status)
        ? false
        : true;
      this.old_job_id = id;
      this.old_job_status = job.status;
      currentJob = {
        status: job.status,
        data: job.data
      }
    }

    return {
      update_graph,
      update_job,
      loading,
      loadingJob,
      s_graph: graph,
      job: currentJob,
      graphExists,
      jobExists
    };
  }
  this.old_job_id = false;
  this.t_count = false;
  return {}
}), connect(mapStateToProps, mapDispatchToProps,),)(HashtagGraph);
