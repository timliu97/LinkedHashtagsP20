/* eslint-disable flowtype/require-valid-file-annotation */

import React, {Component} from 'react';
import {bindActionCreators, compose} from 'redux';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import Drawer from 'material-ui/Drawer';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import ChevronLeftIcon from 'material-ui-icons/ChevronLeft';
import ChevronRightIcon from 'material-ui-icons/ChevronRight';
import {toggleSidebar} from '../actions/UIActions';
import Typography from 'material-ui/Typography';

import HashtagList from './HashtagList';
import SortHLMenu from './SortHLMenu';

const sidebarWidth = 400;

const styles = theme => ({
  header: {
    width: '100%'
  },
  drawerPaper: {
    position: 'absolute',
    height: '100%',
    width: sidebarWidth,
    zIndex: 1,
    // full width when tablet or smartphone
    // [theme.breakpoints.down('md')]: {
    //     zIndex: '2500',
    //     width: '100%',
    //     position: 'absolute',
    // }
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    boxSizing: 'border-box',
    ...theme.mixins.toolbar,
    position: 'fixed',
    width: sidebarWidth,
    backgroundColor: '#fff',
    zIndex: 9,
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
  },
  numberOfNodes: {
    color: '#ccc',
    fontSize: '1rem'
  }
});

class Sidebar extends Component {
  render() {
    const {graphMetadata, classes, theme} = this.props;
    return (<Drawer type="persistent" anchor="right" classes={{
        paper: classes.drawerPaper
      }} open={this.props.sidebarOpen}>
      <div className={classes.drawerHeader}>
        <SortHLMenu/>
        <Typography className={classes.header} type="title" color="primary" align="left" noWrap={true}>
          Hashtag List
          <span className={classes.numberOfNodes}>({graphMetadata.numberOfNodes})</span>
        </Typography>
        <IconButton onClick={() => this.props.toggleSidebar(false)}>
          {
            theme.direction === 'ltr'
              ? <ChevronRightIcon/>
              : <ChevronLeftIcon/>
          }
        </IconButton>
      </div>
      <HashtagList/>
    </Drawer>);
  }
}

Sidebar.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {sidebarOpen: state.ui.sidebarOpen, graphMetadata: state.hashtagGraph.graphMetadata}
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    toggleSidebar: toggleSidebar
  }, dispatch)
}

export default compose(withStyles(styles, {withTheme: true}), connect(mapStateToProps, mapDispatchToProps),)(Sidebar);
