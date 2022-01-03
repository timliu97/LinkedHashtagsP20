/* eslint-disable flowtype/require-valid-file-annotation */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators, compose} from 'redux';
import {connect} from 'react-redux';
import {withStyles} from 'material-ui/styles';
import classNames from 'classnames';
import Drawer from 'material-ui/Drawer';
import List from 'material-ui/List';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import ChevronLeftIcon from 'material-ui-icons/ChevronLeft';
import ChevronRightIcon from 'material-ui-icons/ChevronRight';
import OtherTools from './ToolbarOtherItems';
import GraphTools from './ToolbarGraphTools';
import {toggleToolbar} from '../actions/UIActions';

const toolBarWidth = 240;

const styles = theme => ({
  drawerPaper: {
    position: 'relative',
    height: '100%',
    width: toolBarWidth,
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerPaperClose: {
    width: 60,
    overflowX: 'hidden',
    zIndex: 1000,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  drawerInner: {
    // Make the items inside not wrap when transitioning:
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    width: toolBarWidth
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar
  },
  otherTools: {
    flex: '0 1 auto'
  }
});

class Toolbar extends Component {
  render() {
    const {toolbarOpen, toggleToolbar, classes, theme} = this.props;

    return (<Drawer type="permanent" classes={{
        paper: classNames(classes.drawerPaper, !toolbarOpen && classes.drawerPaperClose)
      }} open={toolbarOpen}>
      <div className={classes.drawerInner}>
        <div className={classes.drawerHeader}>
          <IconButton onClick={() => toggleToolbar(false)}>
            {
              theme.direction === 'rtl'
                ? <ChevronRightIcon/>
                : <ChevronLeftIcon/>
            }
          </IconButton>
        </div>
        <Divider/>
        <List className={classes.list}>
          <GraphTools toolbarOpen={toolbarOpen}/>
        </List>
        <Divider/>
        <List className={classNames(classes.list, classes.otherTools)}>
          <OtherTools toolbarOpen={toolbarOpen}/>
        </List>
      </div>
    </Drawer>);
  }
}

Toolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {toolbarOpen: state.ui.toolbarOpen}
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    toggleToolbar: toggleToolbar
  }, dispatch)
}

export default compose(withStyles(styles, {withTheme: true}), connect(mapStateToProps, mapDispatchToProps),)(Toolbar);
