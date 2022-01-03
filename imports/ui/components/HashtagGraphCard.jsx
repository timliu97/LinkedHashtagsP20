/* eslint-disable flowtype/require-valid-file-annotation */

import React, {Component} from 'react';
import {bindActionCreators, compose} from 'redux';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import {EdgeShapes, RandomizeNodePositions, RelativeSize, Sigma} from 'react-sigma';
import DragNodes from './plugins/DragNodes';
import Lasso from './plugins/LassoReact';
import Card, {CardContent, CardHeader} from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';
import IconButton from 'material-ui/IconButton';
import Button from 'material-ui/Button';
import MoreIcon from 'material-ui-icons/MoreVert';
import ForceLink from 'react-sigma/lib/ForceLink';
import HashtagNetwork from "./HashtagGraph";
import {indigo, pink} from 'material-ui/colors';
import {toggleExportDialog, toggleFullscreen, toggleGraphFilters, toggleGraphParams} from "../actions/UIActions";
import HashtagGraphNodeMenu from './HashtagGraphNodeMenu'
import HashtagGraphHeader from './HashtagGraphHeader'
import {CircularProgress, LinearProgress} from 'material-ui/Progress';
import classNames from "classnames";
import Dagre from 'react-sigma/lib/Dagre';
import ForceAtlas2 from 'react-sigma/lib/ForceAtlas2';
import Filter from 'react-sigma/lib/Filter';
import FilterIcon from 'material-ui-icons/Tune';
import ExportIcon from 'material-ui-icons/FileDownload';
import Tooltip from 'material-ui/Tooltip';
import Divider from 'material-ui/Divider';
import HeatmapDataCard from './HeatmapDataCard'
import ExpansionPanel, {ExpansionPanelDetails, ExpansionPanelSummary, ExpansionPanelActions} from 'material-ui/ExpansionPanel';
import Typography from 'material-ui/Typography';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import AnalyticsPanel from './AnalyticsPanel';
import HeatMapLayer from './HeatMapLayer';
import DashboardTopUsers from './DashboardTopUsers'

const styles = theme => ({
  cardHeader: {
    height: 80,
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
    boxSizing: 'border-box',
    backgroundColor: '#fff',
    zIndex: 99
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    position: 'relative'
  },
  avatar: {
    backgroundColor: indigo[500]
  },
  avatarProgress: {
    fontSize: '0.75rem'
  },
  action: {
    marginTop: theme.spacing.unit,
    marginRight: theme.spacing.unit * 2
  },
  dotsBg: {
    padding: '0!important',
    background: "linear-gradient(90deg, #fbfbfb 20px, transparent 1%) center, linear-gradient(#fbfbfb 20px, transparent 1%) center, #dadada",
    backgroundSize: "22px 22px"
  },
  fullScreenCard: {
    position: 'absolute',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    width: '100%'
  },
  fullScreenBlueprint: {
    height: 'calc(100% - 78px)'
  },
  filtersInline: {
    paddingLeft: 0,
    listStyle: 'none',
    margin: 0
  },
  filterListItem: {
    display: 'inline-block',
    marginRight: theme.spacing.unit
  },
  fabProgress: {
    color: pink['A200'],
    position: 'absolute',
    top: -5,
    left: -5,
    zIndex: 1
  },
  wrapper: {
    margin: theme.spacing.unit,
    position: 'relative'
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular
  }
});

class HashtagGraphCard extends Component {

  contextMenu(e) {
    e.preventDefault();
  }

  render() {
    const {
      toggleExportDialog,
      graphSettings,
      graphLayout,
      params,
      hiddenHashtags,
      job,
      query,
      graphData,
      graphTimestamp,
      isDashboardMode,
      classes
    } = this.props;

    let waitTime = 1600;
    const lengthEdgeArray = graphData.edges.length;

    if (job && job.status == "running") {
      waitTime = 1500;
    } else if (lengthEdgeArray > 2000) {
      waitTime = 8000;
    } else if (lengthEdgeArray > 1000) {
      waitTime = 5000;
    } else if (lengthEdgeArray > 500) {
      waitTime = 2000;
    }
    switch (graphLayout) {
      case 'ForceAtlas2':
        graphLayoutSet = <ForceAtlas2 scalingRatio={5} key={graphTimestamp}/>;
        break;
      case 'Dagre':
        graphLayoutSet = <Dagre key={graphTimestamp}/>;
        break;
      default: //'ForceLayout' and others
        graphLayoutSet = <ForceLink randomize="locally" barnesHutOptimize={false} barnesHutTheta={0.5} background={false} easing="cubicInOut" gravity={1} edgeWeightInfluence={0} alignNodeSiblings={true} timeout={waitTime} outboundAttractionDistribution={false} key={graphTimestamp}/>;
    }

    let sigma_style = {
      'height': '100%'
    };

    let map_div = <div></div>;
    let top_user_div = <div></div>;
    let card_style = {};
    if (isDashboardMode) {
      sigma_style = {
        'height': '100%',
        'width': '50%'
      };
      card_style = {
        'display': 'flex',
        'flexWrap': 'wrap'
      };
      map_div = <div style={{
          height: '50%',
          width: '100%'
        }}>
        <HeatMapLayer id={this.props.id}/>
      </div>;
      top_user_div = <div style={{
          height: '50%',
          width: '100%'
        }}>
        <DashboardTopUsers/>
      </div>
    }

    return (<Card className={classNames(classes.cardContent, classes.fullScreenCard)}>
      <HashtagGraphHeader id={this.props.id}/>
      <AnalyticsPanel/>
      <CardContent className={classNames(classes.dotsBg, classes.fullScreenBlueprint)} onContextMenu={this.contextMenu} style={card_style}>
        <Sigma renderer="canvas" settings={graphSettings} style={sigma_style}>
          <HashtagNetwork graph={graphData} id={this.props.id}>
            {graphLayoutSet}
            <DragNodes/>
            <Lasso/>
          </HashtagNetwork>
        </Sigma>
        <div style={{
            height: '100%',
            width: '50%'
          }}>
          {top_user_div}
          {map_div}
        </div>
        <HashtagGraphNodeMenu/>
        <HeatmapDataCard id={this.props.id}/>
      </CardContent>
    </Card>);
  }
}

HashtagGraphCard.propTypes = {
  classes: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    query: state.hashtagGraph.query,
    params: state.hashtagGraph.params,
    graphData: state.hashtagGraph.graphData,
    hiddenHashtags: state.hashtagGraph.hidden,
    graphTimestamp: state.hashtagGraph.timestamp,
    graphLayout: state.hashtagGraph.graphLayout,
    graphSettings: state.hashtagGraph.settings,
    job: state.job.currentJob,
    isDashboardMode: state.ui.isDashboardMode
  }
}

export default compose(withStyles(styles, {withTheme: true}), connect(mapStateToProps,),)(HashtagGraphCard);
