import React, {Component} from 'react';
import {MenuList, MenuItem} from 'material-ui/Menu';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {toggleGraphParams} from '../actions/UIActions';
import {refreshGraph, setGraphLayout, updateGraphParams} from "../actions/HashtagGraphActions";
import {ListItemIcon, ListItemText, ListSubheader} from 'material-ui/List';
import RefreshIcon from 'material-ui-icons/Refresh';
import RadioButtonChecked from 'material-ui-icons/RadioButtonChecked';
import RadioButtonUnchecked from 'material-ui-icons/RadioButtonUnchecked';

class MenuGraphParams extends Component {

  render() {
    const {graphParamsAnchorEl, currentGraphLayout, setGraphLayout, refreshGraph} = this.props;
    const open = Boolean(graphParamsAnchorEl);

    let layouts = ['ForceLink', 'ForceAtlas2', 'Dagre'];
    return (<MenuList role="menu">
      <MenuItem onClick={() => refreshGraph()}>
        <ListItemIcon>
          <RefreshIcon/>
        </ListItemIcon>
        <ListItemText primary="Refresh"/>
      </MenuItem>
      <ListSubheader>{'Layouts'}</ListSubheader>
      {
        layouts.map((layout, i) => (<MenuItem onClick={() => setGraphLayout(layout)} key={i}>
          <ListItemIcon>
            {
              layout === currentGraphLayout
                ? (<RadioButtonChecked/>)
                : (<RadioButtonUnchecked/>)
            }
          </ListItemIcon>
          <ListItemText primary={layout}/>
        </MenuItem>))
      }
    </MenuList>);
  }
}

function mapStateToProps(state) {
  return {currentGraphLayout: state.hashtagGraph.graphLayout, graphParamsAnchorEl: state.ui.graphParamsAnchorEl}
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    toggleGraphParams: toggleGraphParams,
    updateGraphParams: updateGraphParams,
    refreshGraph: refreshGraph,
    setGraphLayout: setGraphLayout
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps,)(MenuGraphParams);
