import React, {Component} from 'react';
import Menu, {MenuItem} from 'material-ui/Menu';
import {bindActionCreators, compose} from 'redux';
import {connect} from 'react-redux';
import {hideHashtag, highlightHashtag, showNeighbors} from "../actions/HashtagGraphActions";
import {ListItemIcon, ListItemText} from 'material-ui/List';
import HideIcon from 'material-ui-icons/Close';
import ShowIcon from 'material-ui-icons/Add';
import HighlightIcon from 'material-ui-icons/Toll';
import {withStyles} from "material-ui/styles";
import classNames from 'classnames';
import {toggleNodeActions} from "../actions/UIActions";

const styles = theme => ({
  highlighted: {
    color: theme.palette.primary[500]
  }
});

class HGNodeMenu extends Component {
  render() {
    const {hiddenHashtags, highlightedHashtags, nodeActions, classes} = this.props;

    let highlightText = '';
    let hideText = '';
    let hideIcon = <HideIcon/>;
    let isHighlighted = false;
    if (nodeActions.nodeData) {
      const isHidden = hiddenHashtags.indexOf(nodeActions.nodeData.id) !== -1;
      isHighlighted = highlightedHashtags.indexOf(nodeActions.nodeData.id) !== -1;

      highlightText = (isHighlighted)
        ? 'Tone Down'
        : 'Highlight';
      hideText = (isHidden)
        ? 'Show'
        : 'Hide';
      hideIcon = (isHidden)
        ? <ShowIcon/>
        : <HideIcon/>;
    }

    return (<Menu id="node-actions-menu" anchorReference="anchorPosition" anchorPosition={{
        top: nodeActions.nodePosition.top,
        left: nodeActions.nodePosition.left
      }} open={nodeActions.open} onClose={() => this.props.toggleNodeActions(false)} transformOrigin={{
        vertical: 'top',
        horizontal: 'left'
      }}>
      <MenuItem onClick={() => this.props.highlightHashtag(nodeActions.nodeData.id)}>
        <ListItemIcon className={classNames(isHighlighted && classes.highlighted)}>
          <HighlightIcon/>
        </ListItemIcon>
        <ListItemText primary={highlightText}/>
      </MenuItem>
      {/* <MenuItem onClick={() => this.props.showNeighbors(nodeActions.nodeData)}> */}
      {/* <ListItemIcon> */}
      {/* <ShowNeighborsIcon/> */}
      {/* </ListItemIcon> */}
      {/* <ListItemText primary="Show Neighbors"/> */}
      {/* </MenuItem> */}
      <MenuItem onClick={() => this.props.hideHashtag(nodeActions.nodeData.id)}>
        <ListItemIcon>
          {hideIcon}
        </ListItemIcon>
        <ListItemText primary={hideText}/>
      </MenuItem>
    </Menu>);
  }
}

function mapStateToProps(state) {
  return {highlightedHashtags: state.hashtagGraph.highlighted, hiddenHashtags: state.hashtagGraph.hidden, nodeActions: state.ui.nodeActions}
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    toggleNodeActions: toggleNodeActions,
    highlightHashtag: highlightHashtag,
    hideHashtag: hideHashtag,
    showNeighbors: showNeighbors
  }, dispatch)
}

export default compose(withStyles(styles, {withTheme: true}), connect(mapStateToProps, mapDispatchToProps,),)(HGNodeMenu);
