import React, {Component} from 'react';
import {bindActionCreators, compose} from 'redux';
import {connect} from 'react-redux';
import {withStyles} from 'material-ui/styles';
import classNames from 'classnames';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import ToggleSidebarIcon from 'material-ui-icons/ChevronLeft';
import MenuIcon from 'material-ui-icons/Menu';
import {toggleSidebar, toggleToolbar} from '../actions/UIActions';
import Search from './Search';
import JobTable from './JobsTable'
const toolbarWidth = 240;
const sidebarWidth = 400;
import {Meteor} from 'meteor/meteor';
import {withTracker} from 'meteor/react-meteor-data';
import {controlJob, setStreamJobId} from '../actions/JobsActions';
const styles = theme => ({
  menuButton: {
    marginLeft: 12,
    marginRight: 36
  },
  sidebarButton: {
    marginLeft: 'auto',
    marginRight: 12
  },
  hide: {
    display: 'none'
  },
  appBar: {
    position: 'absolute',
    zIndex: theme.zIndex.navDrawer + 1000,
    transition: theme.transitions.create([
      'width', 'margin'
    ], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    [theme.breakpoints.down('md')]: {
      width: '100%!important',
      margin: '0!important'
    }
  },
  appBarShiftToolbar: {
    marginLeft: toolbarWidth,
    width: `calc(100% - ${toolbarWidth}px)`,
    transition: theme.transitions.create([
      'width', 'margin'
    ], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  appBarShiftSidebar: {
    marginRight: sidebarWidth,
    width: `calc(100% - ${sidebarWidth}px)`,
    transition: theme.transitions.create([
      'width', 'margin'
    ], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  appBarShift: {
    width: `calc(100% - ${sidebarWidth}px - ${toolbarWidth}px)!important`
  }
});

class Header extends Component {
  render() {
    const {classes, isUserGuest, setStreamJobId} = this.props;

    return (<AppBar className={classNames(classes.appBar, this.props.toolbarOpen && classes.appBarShiftToolbar, this.props.sidebarOpen && classes.appBarShiftSidebar, this.props.toolbarOpen && this.props.sidebarOpen && classes.appBarShift)}>
      <Toolbar disableGutters={!this.props.toolbarOpen}>
        <IconButton color="inherit" aria-label="open drawer" onClick={() => this.props.toggleToolbar(true)} className={classNames(classes.menuButton, this.props.toolbarOpen && classes.hide)}>
          <MenuIcon/>
        </IconButton>
        <Typography type="title" color="inherit" noWrap={true}>
          LinkedHashtags
        </Typography>
        <Search/>
        <IconButton color="inherit" aria-label="open sidebar" onClick={() => this.props.toggleSidebar(true)} className={classNames(classes.sidebarButton, this.props.sidebarOpen && classes.hide)}>
          <ToggleSidebarIcon/>
        </IconButton>
      </Toolbar>


    </AppBar>);
  }
}

function mapStateToProps(state) {
  return {toolbarOpen: state.ui.toolbarOpen, sidebarOpen: state.ui.sidebarOpen}
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    toggleToolbar: toggleToolbar,
    toggleSidebar: toggleSidebar,
    setStreamJobId: setStreamJobId
  }, dispatch)
}

export default compose(withTracker(() => {
  const userId = Meteor.userId();
  return {
    currentUser: userId,
    isUserGuest: Roles.userIsInRole(userId, 'guest')
  }
}),withStyles(styles, {withTheme: true}), connect(mapStateToProps, mapDispatchToProps),)(Header);
