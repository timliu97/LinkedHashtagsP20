import React, {Component} from 'react';
import {bindActionCreators, compose} from 'redux';
import {connect} from 'react-redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import HashtagNetworkCard from './HashtagGraphCard';
import TweetsCard from './EdgeDataCard';
import EventsCard from './EventDataCard';
import InfoBar from './ParamsInfo';
import Snackbar from 'material-ui/Snackbar';
import {toggleSnackbar, toggleFullscreen} from "../actions/UIActions";
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui-icons/Close';
import Fullscreen from 'react-fullscreen-crossbrowser';
const sidebarWidth = 400;

const styles = theme => ({
  content: {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    width: '100%',
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    height: 'calc(100% - 64px)',
    marginTop: 64,
    overflow: 'hidden'
  },
  contentShift: {
    marginRight: sidebarWidth,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  graphFrame: {
    boxSizing: 'border-box',
    flexGrow: 1,
    padding: theme.spacing.unit * 2,
    transition: theme.transitions.create('padding', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  fullScreenCard: {
    position: 'relative',
    flexGrow: 1,
    padding: 0
  },
  close: {
    width: theme.spacing.unit * 4,
    height: theme.spacing.unit * 4
  }
});

class Content extends Component {

  render() {
    const {
      streamJobId,
      snackbar,
      snackbarOpen,
      toggleSnackbar,
      sidebarOpen,
      isFullscreen,
      classes
    } = this.props;

    let closeSnackbar = null;
    if (snackbar.error) {
      closeSnackbar = [<IconButton key="close" aria-label="Close" color="inherit" className={classes.close} onClick={() => toggleSnackbar(false)}>
        <CloseIcon/>
      </IconButton>
        ];
    }

    return (<main className={classNames(classes.content, sidebarOpen && classes.contentShift)} style={{
        position: "relative",
        zIndex: 2,
        overflow: "inherit"
      }}>
      <InfoBar/>
      <div className={classNames(classes.graphFrame, classes.fullScreenCard)}>
        <Fullscreen enabled={isFullscreen} onChange={_isFullscreen => this.props.toggleFullscreen(_isFullscreen)}>
          <HashtagNetworkCard id={streamJobId}/>
          <EventsCard id={streamJobId}/>
          <TweetsCard/>
        </Fullscreen>
      </div>
      <Snackbar anchorOrigin={snackbar.anchorOrigin} open={snackbarOpen} SnackbarContentProps={{
          'aria-describedby' : 'message-id'
        }} message={<span id = "message-id" > {
          snackbar.message
        }
        </span>} action={closeSnackbar}/>
    </main>);
  }
}

Content.propTypes = {
  classes: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    streamJobId: state.job.streamJobId,
    sidebarOpen: state.ui.sidebarOpen,
    snackbarOpen: state.ui.snackbarOpen,
    isFullscreen: state.ui.isFullscreen,
    snackbar: state.ui.snackbar,
    streamingOn: state.ui.streamingOn
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    toggleSnackbar: toggleSnackbar,
    toggleFullscreen: toggleFullscreen
  }, dispatch)
}

export default compose(withStyles(styles, {withTheme: true}), connect(mapStateToProps, mapDispatchToProps,),)(Content);
