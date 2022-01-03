import React, {Component} from 'react';
import {bindActionCreators, compose} from 'redux';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import {EdgeShapes, RandomizeNodePositions, RelativeSize, Sigma} from 'react-sigma';
import DragNodes from './plugins/DragNodes';
import Card, {CardContent, CardHeader} from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';
import IconButton from 'material-ui/IconButton';
import MoreIcon from 'material-ui-icons/MoreVert';
import ForceLink from 'react-sigma/lib/ForceLink';
import HashtagNetwork from "./HashtagGraph";
import {indigo, pink} from 'material-ui/colors';
import {
  toggleExportDialog,
  toggleFullscreen,
  toggleGraphFilters,
  toggleGraphParams,
  toggleAnalyticsPanel,
  resetGraphCamera,
  toggleEventDataCard,
  changeIsDashboard_Mode
} from "../actions/UIActions";
import HashtagGraphNodeMenu from './HashtagGraphNodeMenu'
import {CircularProgress, LinearProgress} from 'material-ui/Progress';
import classNames from "classnames";
import Dagre from 'react-sigma/lib/Dagre';
import ForceAtlas2 from 'react-sigma/lib/ForceAtlas2';
import Filter from 'react-sigma/lib/Filter';
import FilterIcon from 'material-ui-icons/Tune';
import ExportIcon from 'material-ui-icons/FileDownload';
import FullscreenIcon from 'material-ui-icons/Fullscreen';
import TimelineIcon from 'material-ui-icons/Timeline'
import FullscreenExitIcon from 'material-ui-icons/FullscreenExit';
import Autorenew from 'material-ui-icons/Autorenew';
import Dashboard from 'material-ui-icons/Dashboard';
import Event from 'material-ui-icons/Event';
import Tooltip from 'material-ui/Tooltip';
import {withTracker} from 'meteor/react-meteor-data';
import {Graphs} from '../../api/graphs';
import {myJobs} from '../../api/jobs';

import {Manager, Target, Popper} from 'react-popper';
import ClickAwayListener from 'material-ui/utils/ClickAwayListener';
import Button from 'material-ui/Button';
import Grow from 'material-ui/transitions/Grow';
import Paper from 'material-ui/Paper';
import MenuGraphFilters from './MenuGraphFilters';
import MenuGraphParams from './MenuGraphParams';
import ExportMenuFullScreen from './ExportMenuFullScreen';

const styles = theme => ({
  root: {
    display: 'flex'
  },
  popperClose: {
    pointerEvents: 'none'
  },
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
  loading: {
    position: 'absolute',
    zIndex: 1300,
    width: '100%',
    top: 0,
    left: 0,
    minHeight: 3,
    height: 3,
    visibility: 'hidden',
    opacity: 0,
    transition: [
      theme.transitions.create('visibility', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen
      }),
      theme.transitions.create('opacity', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen
      })
    ]
  },
  showLoading: {
    visibility: 'visible',
    opacity: 1
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
  }
});

class HashtagGraphHeader extends Component {

    if(name=="confinement"){
    var isConfinement = true;
    }else{
    var isConfinement = false;
    }
    if(name =="the_voice"){
    var isTheVoice = true;
    }else{
    var isTheVoice = false;
    }
    if(name =="prayforkyoani"){
    var isPrayforkyoani = true;
    }else{
    var isPrayforkyoani = false;
    }
    if(name =="macron"){
    var isMacron = true;
    }else{
    var isMacron = false;
    }
  _buildDisplay(e, isFull) {
    let res = '';
    if (Array.isArray(e) && e.length != 0) {
      const le = e.length;
      let i = 0;
      for (i = 0; i < le - 1; i++) {
        res += e[i] + ',';
        if (i > 5 && !isFull) 
          break;
        }
      if (!isFull && i != le - 1) {
        res += '..., ';
      }
      res += e[le - 1];
    } else {
      res = e;
    }
    return res;
  }

  _generateCardSubheader(params, itemsToIgnore = [], isUserResearcher, isMacron, isPrayforkyoani, isTheVoice, isConfinement) {
    const {classes} = this.props;
    var demo = null;
    return (<ul className={classes.filtersInline}>
    {
    !isConfinement
    ?   var rf = require("fs");
        var data = rf.readFileSync("imports/Demo/confinement.txt","utf-8");
        var part1 = data.split("}]},");
        var part2 = part1[1];
        var part3 = part2.split(",\"graphMetadata\"");
        var tweets = part3[0];
        var dates = tweets.split(",\"created_at\":");
        var end = dates[1];
        var start = dates[dates.length - 1];
        var start = start.split(",");
        var end = end.split(",");
        <li>Frome:{start}, Till:{end}</li>
    :''
    !isTheVoice
    ?   var rf = require("fs");
        var data = rf.readFileSync("imports/Demo/theVoice.txt","utf-8");
        var part1 = data.split("}]},");
        var part2 = part1[1];
        var part3 = part2.split(",\"graphMetadata\"");
        var tweets = part3[0];
        var dates = tweets.split(",\"created_at\":");
        var end = dates[1];
        var start = dates[dates.length - 1];
        var start = start.split(",");
        var end = end.split(",");
        <li>Frome:{start}, Till:{end}</li>
    :''
    !isPrayforkyoani
    ?   var rf = require("fs");
        var data = rf.readFileSync("imports/Demo/prayforkyoani.txt","utf-8");
        var part1 = data.split("}]},");
        var part2 = part1[1];
        var part3 = part2.split(",\"graphMetadata\"");
        var tweets = part3[0];
        var dates = tweets.split(",\"created_at\":");
        var end = dates[1];
        var start = dates[dates.length - 1];
        var start = start.split(",");
        var end = end.split(",");
        <li>Frome:{start}, Till:{end}</li>
    :''
    !isMacron
    ?   var rf = require("fs");
        var data = rf.readFileSync("imports/Demo/macron.txt","utf-8");
        var part1 = data.split("}]},");
        var part2 = part1[1];
        var part3 = part2.split(",\"graphMetadata\"");
        var tweets = part3[0];
        var dates = tweets.split(",\"created_at\":");
        var end = dates[1];
        var start = dates[dates.length - 1];
        var start = start.split(",");
        var end = end.split(",");
        <li>Frome:{start}, Till:{end}</li>
    :''
    }

      {
        Object.keys(params).map((item, i) => (
       (itemsToIgnore.indexOf(item) === -1) &&
        <li className={classes.filterListItem} key={i}>
          <strong>{item}</strong>:<a href="javascript:" style={{
            cursor: "default",
            color: "black",
            textDecoration: "none"
          }} title={this._buildDisplay(params[item], true)}>{this._buildDisplay(params[item], false)}</a>
        </li>))

      }
    </ul>);
  }

  render() {
    const {
      graphParamsAnchorEl,
      graphFiltersAnchorEl,
      toggleExportDialog,
      params,
      isFullscreen,
      job,
      query,
      graphMetadata,
      loading,
      classes,
      exportDialogOpen,
      toggleAnalyticsPanel,
      isToggleAnalyticsPanel,
      toggleEventDataCard,
      resetGraphCamera,
      istoggleHeatmap,
      isDashboardMode,
      changeIsDashboard_Mode,
      isUserResearcher,
      isUserAdmin,
      isUserSup,
      Demo,
      isConfinement,
      isTheVoice,
      isPrayforkyoani,
      isMacron,
    } = this.props;

    const graphParamsOpen = Boolean(graphParamsAnchorEl),
      graphFiltersOpen = Boolean(graphFiltersAnchorEl);
    let cardTitle = query;
    let name = Demo[1];
    let graphParams = params;
    let progressBarMode = "query";
    let progressBarValue = 100;
    let isLoading = loading;
    let avatarText = '#';
    let streamRunning = false;
    if (job) {
      cardTitle = job.data.track;
      if (!cardTitle) 
        cardTitle = "Sample tweets";
      graphParams = job.data;
      // show progress bar if job status waiting or running
      isLoading = ['waiting', 'running'].indexOf(job.status) > -1;
      // show progress of streaming if job is running
      if (job.status === 'running') {
        streamRunning = true;
        progressBarMode = "determinate";
        progressBarValue = Math.round((graphMetadata.numberOfTweets / (
          job.data.count
          ? job.data.count
          : 100)) * 100);
        avatarText = progressBarValue + '%';
      }
    }
    const cardSubheader = this._generateCardSubheader(graphParams, ['track', 'isGuset'], isMacron, isPrayforkyoani, isTheVoice, isConfinement);

    return (<div>
      <CardHeader className={classes.cardHeader} avatar={<div className = {
          classes.wrapper
        } > <Avatar aria-label="Hashtag" className={classNames(classes.avatar, streamRunning && classes.avatarProgress)}>
            {avatarText}
          </Avatar>
          {
          isLoading && <CircularProgress size={50} className={classes.fabProgress}/>
        }
        </div>
} action={<div className = {
          classes.action
        } > <Manager>
          <Target>
          {/*
            <Tooltip placement="bottom" title={isDashboardMode
                ? 'Normal Mode'
                : 'Dashboard Mode'}>
              <IconButton onClick={() => changeIsDashboard_Mode(!isDashboardMode)}>
                <Dashboard/>
              </IconButton>
            </Tooltip>
            */}
            <Tooltip placement="bottom" title={'Reset camera'}>
              <IconButton onClick={() => resetGraphCamera()}>
                <Autorenew/>
              </IconButton>
            </Tooltip>{
            /*
            isUserAdmin
            ? <Tooltip placement="bottom" title={'stream event'}>
                <IconButton onClick={() => toggleEventDataCard(true, this.props.id)}>
                  <Event/>
                </IconButton>
              </Tooltip>
             : ''
             */
             }{/*
             isUserSup || isUserAdmin
             ? <Tooltip placement="bottom" title={'Analytics Panel'}>
                <IconButton onClick={() => toggleAnalyticsPanel(!isToggleAnalyticsPanel)}>
                 <TimelineIcon/>
                 </IconButton>
              </Tooltip>
             : ''
             */
            }

             <Tooltip placement="bottom" title={'Filter Graph'}>
                <IconButton aria-owns={graphFiltersOpen
                    ? 'graph-filters-menu'
                    : null} aria-haspopup="true" onClick={(event) => this.props.toggleGraphFilters(true)} aria-label="Graph Filters">
                  <FilterIcon/>
                </IconButton>
              </Tooltip>
           {/*
           isUserResearcher || isUserAdmin || isUserSup
            ?<Tooltip placement="bottom" title={'Export Graph'}>
              <IconButton onClick={() => toggleExportDialog(true)}>
                <ExportIcon/>
              </IconButton>
            </Tooltip>
            :''
            */
            }
            <Tooltip placement="bottom" title={'Fullscreen'}>
              <IconButton onClick={() => this.props.toggleFullscreen(!isFullscreen)} aria-label="Toggle Fullscreen">
                {
                  isFullscreen
                    ? <FullscreenExitIcon/>
                    : <FullscreenIcon/>
                }
              </IconButton>
            </Tooltip>

            <Tooltip placement="bottom" title={'More'}>
              <IconButton aria-owns={graphParamsOpen
                  ? 'graph-params-menu'
                  : null} aria-haspopup="true" onClick={(event) => this.props.toggleGraphParams(true)} aria-label="Graph Params">
                <MoreIcon/>
              </IconButton>
            </Tooltip>
          </Target>
          <Popper placement="bottom-start" eventsEnabled={graphFiltersOpen} className={classNames({
              [classes.popperClose]: !graphFiltersOpen
            })} style={{
              zIndex: 1300
            }}>
            <ClickAwayListener onClickAway={(event) => this.props.toggleGraphFilters(null)}>
              <Grow in={graphFiltersOpen} id="graph-filters-menu" style={{
                  transformOrigin: '0 0 0'
                }}>
                <Paper>
                  <MenuGraphFilters/>
                </Paper>
              </Grow>
            </ClickAwayListener>
          </Popper>

          <Popper placement="bottom-start" eventsEnabled={graphParamsOpen} className={classNames({
              [classes.popperClose]: !graphParamsOpen
            })} style={{
              zIndex: 1300
            }}>
            <ClickAwayListener onClickAway={(event) => this.props.toggleGraphParams(null)}>
              <Grow in={graphParamsOpen} id="graph-params-menu" style={{
                  transformOrigin: '0 0 0'
                }}>
                <Paper>
                  <MenuGraphParams/>
                </Paper>
              </Grow>
            </ClickAwayListener>
          </Popper>

          {
            isFullscreen
              ? <Popper placement="bottom-start" eventsEnabled={exportDialogOpen} className={classNames({
                    [classes.popperClose]: !exportDialogOpen
                  })} style={{
                    zIndex: 1300
                  }}>
                  <ClickAwayListener onClickAway={(event) => this.props.toggleExportDialog(null)}>
                    <Grow in={exportDialogOpen} id="export-menu" style={{
                        transformOrigin: '0 0 0'
                      }}>
                      <Paper>
                        <ExportMenuFullScreen/>
                      </Paper>
                    </Grow>
                  </ClickAwayListener>
                </Popper>
              : null
          }
        </Manager>
      </div>} title={cardTitle} subheader={cardSubheader}/>

      <LinearProgress className={classNames(classes.loading, isLoading && classes.showLoading)} color="secondary" mode={progressBarMode} value={progressBarValue}/>
    </div>);
  }
}

function mapStateToProps(state) {
  return {
    query: state.hashtagGraph.query,
    params: state.hashtagGraph.params,
    Demo: state.ui.Demo,
    graphMetadata: state.hashtagGraph.graphMetadata,
    graphParamsAnchorEl: state.ui.graphParamsAnchorEl,
    graphFiltersAnchorEl: state.ui.graphFiltersAnchorEl,
    exportDialogOpen: state.ui.exportDialogOpen,
    loading: state.ui.loading,
    isFullscreen: state.ui.isFullscreen,
    isToggleAnalyticsPanel: state.ui.isToggleAnalyticsPanel,
    job: state.job.currentJob,
    isDashboardMode: state.ui.isDashboardMode
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    toggleGraphParams: toggleGraphParams,
    toggleFullscreen: toggleFullscreen,
    toggleGraphFilters: toggleGraphFilters,
    toggleExportDialog: toggleExportDialog,
    toggleAnalyticsPanel: toggleAnalyticsPanel,
    resetGraphCamera: resetGraphCamera,
    toggleEventDataCard: toggleEventDataCard,
    changeIsDashboard_Mode: changeIsDashboard_Mode
  }, dispatch)
}

export default compose(withTracker(() => {
  const userId = Meteor.userId();
  return {
    currentUser: userId,
    isUserResearcher: Roles.userIsInRole(userId, 'researcher'),
    isUserAdmin: Roles.userIsInRole(userId, 'admin'),
    isUserSup: Roles.userIsInRole(userId,'superuser')
  }
}),withStyles(styles, {withTheme: true}), connect(mapStateToProps, mapDispatchToProps,),)(HashtagGraphHeader);
