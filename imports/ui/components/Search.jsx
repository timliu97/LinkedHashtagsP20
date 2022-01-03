import React, {Component} from 'react';
import {bindActionCreators, compose} from 'redux';
import {connect} from 'react-redux';
import {withStyles} from 'material-ui/styles';
import classNames from 'classnames';
import IconButton from 'material-ui/IconButton';
import StreamIcon from 'material-ui-icons/WifiTethering';
import HistoryIcon from 'material-ui-icons/History';
import SearchBar from 'material-ui-search-bar'
import {blueGrey} from 'material-ui/colors';
import {getFormValues} from 'redux-form';
import {toggleStreamDialog, toggleHistoryDialog} from "../actions/UIActions";
import {fetchHistoryTweets, updateCurrentQuery} from "../actions/HashtagGraphActions";
import StreamDialog from './StreamDialog';
import HistoryDialog from './HistoryDialog';
import {createJob} from "../actions/JobsActions";
import {withTracker} from 'meteor/react-meteor-data';
import {Meteor} from 'meteor/meteor';
import ViewIcon from 'material-ui-icons/Visibility';
import {controlJob, setStreamJobId} from "../actions/JobsActions";
import {showHistory} from "../actions/HashtagGraphActions";
import FeedbackIcon from 'material-ui-icons/Feedback';

const styles = theme => ({
  searchContainer: {
    display: 'flex',
    flexGrow: 1
  },
  streamButton: {
    marginRight: '-1px'
  },
  historyButton: {
    marginRight: 'auto'
  },
  controlButton: {
    marginLeft: 0,
    background: 'linear-gradient(45deg, ' + blueGrey['50'] + ' 30%, ' + blueGrey['50'] + ' 90%)',
    backgroundColor: theme.palette.primary['50'],
    borderRadius: '0 2px 2px 0',
    color: blueGrey['300'],
    transition: [
      theme.transitions.create('background', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      }),
      theme.transitions.create('color', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      })
    ]
  },
  streamActive: {
    background: 'linear-gradient(45deg, #9295FC 30%, #E5A4F8 90%)',
    backgrounColor: '#9295FC',
    color: '#fff'
  },
  searchBar: {
    margin: '0 0 0 auto',
    maxWidth: '70%',
    width: '70%',
    borderRadius: '2px 0 0 2px'
  }
});

class Search extends Component {
  render() {
    const {
      isUserResearcher,
      streamingOn,
      currentQuery,
      fetchHistoryTweets,
      createJob,
      updateCurrentQuery,
      searchParams,
      streamParams,
      classes,
      isUserSup,
      isUserAdmin
    } = this.props;

    const placeholder = streamingOn
      ? 'Track one or more hashtags (eg. #Obama,#Trump)'
      : 'Search for hashtags (eg. #Obama)';
    let onRequest = (q) => {
      // trigger search only if query is not empty
      if (q !== '') {
        fetchHistoryTweets(q, searchParams);
      }
    };
    if (streamingOn) {
      onRequest = (q) => {
        if (q !== '') {
          createJob('streamTweets', {
            track: q,
            ...streamParams
          });
        } else {
          createJob('streamTweets', {
            track: false,
            ...streamParams
          });
        }
      };
    }

    return (<div className={classes.searchContainer}>
    {
    /*
 <SearchBar onRequestSearch={onRequest} value={currentQuery} onChange={(val) => updateCurrentQuery(val)} placeholder={placeholder} style={{
          margin: isUserSup || isUserAdmin
            ? '0 0 0 auto'
            : '0 auto',
          maxWidth: '70%',
          width: '70%',
          borderRadius: isUserSup || isUserAdmin
            ? '2px 0 0 2px'
            : '2px'
        }}/> {
        isUserSup || isUserAdmin
          ? <IconButton aria-label="open stream dialog" onClick={() => this.props.toggleStreamDialog(true)} className={classNames(classes.controlButton, classes.streamButton, streamingOn && classes.streamActive)}>
              <StreamIcon/>
            </IconButton>
          : ''
      }{
      isUserSup || isUserAdmin || isUserResearcher
      ?<IconButton aria-label="open history dialog" onClick={() => this.props.toggleHistoryDialog(true)} className={classNames(classes.controlButton, classes.streamButton)}>
        <HistoryIcon/>
      </IconButton>
      :''}
      <IconButton aria-label="show demo" onClick={() => this.props.showHistory("SuHdM6s2rgieWLncD")} className={classNames(classes.controlButton, classes.historyButton)}>
        <FeedbackIcon/>
      </IconButton>
      <StreamDialog/>
      <HistoryDialog/>
*/
}
    </div>);
  }
}

function mapStateToProps(state) {
  return {
    currentQuery: state.hashtagGraph.currentQuery, searchParams: getFormValues('SearchParams')(state),
    streamParams: getFormValues('StreamParams')(state),
    streamingOn: state.ui.streamingOn
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    toggleStreamDialog: toggleStreamDialog,
    toggleHistoryDialog: toggleHistoryDialog,
    fetchHistoryTweets: fetchHistoryTweets,
    createJob: createJob,
    updateCurrentQuery: updateCurrentQuery,
    setStreamJobId: setStreamJobId,
    controlJob: controlJob,
    showHistory: showHistory
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
}),withStyles(styles, {withTheme: true}), connect(mapStateToProps, mapDispatchToProps),)(Search);
