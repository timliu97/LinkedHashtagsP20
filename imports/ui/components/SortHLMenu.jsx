import React, {Component} from 'react';
import IconButton from 'material-ui/IconButton';
import Menu, {MenuItem} from 'material-ui/Menu';
import SortIcon from 'material-ui-icons/Sort';
import {bindActionCreators, compose} from "redux";
import {withStyles} from 'material-ui/styles';
import {connect} from "react-redux";
import {sortHashtagList, toggleSortHL} from "../actions/UIActions";
import AscIcon from 'material-ui-icons/ArrowDropUp';
import DescIcon from 'material-ui-icons/ArrowDropDown';
import {ListItemIcon, ListItemText, ListSubheader} from 'material-ui/List';
import Tooltip from 'material-ui/Tooltip';

const styles = theme => ({
  menuItem: {
    '&:focus': {
      background: theme.palette.primary[500],
      '& $text, & $icon': {
        color: theme.palette.common.white
      }
    }
  },
  text: {},
  icon: {}
});

class SortHLMenu extends Component {

  render() {
    const {sortHLAnchorEl, sort, toggleSortHL, classes} = this.props;
    const open = Boolean(sortHLAnchorEl);

    // TODO: Improve algorithm
    let labelIcon = <SortIcon/>;
    let weightIcon = <SortIcon/>;
    if (sort.by === 'label') {
      if (sort.direction === 'asc') {
        labelIcon = <AscIcon/>;
      } else {
        labelIcon = <DescIcon/>
      }
    } else {
      if (sort.direction === 'asc') {
        weightIcon = <AscIcon/>;
      } else {
        weightIcon = <DescIcon/>
      }
    }

    const oppositeDirection = (sort.direction === 'asc')
      ? 'desc'
      : 'asc';

    return (<div>
      <Tooltip placement="bottom" title={'Sort Hashtags'}>
        <IconButton aria-label="More" aria-owns={open
            ? 'long-menu'
            : null} aria-haspopup="true" onClick={(e) => toggleSortHL(e.currentTarget)}>
          <SortIcon/>
        </IconButton>
      </Tooltip>
      <Menu id="long-menu" anchorEl={sortHLAnchorEl} open={open} anchorOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }} transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }} onClose={() => toggleSortHL(null)}>
        <ListSubheader>{'Sort Hashtags'}</ListSubheader>
        <MenuItem key={1} selected={sort.by === 'label'} onClick={() => this.props.sortHashtagList('label', oppositeDirection)} className={classes.menuItem}>
          <ListItemIcon className={classes.icon}>
            {labelIcon}
          </ListItemIcon>
          <ListItemText classes={{
              text: classes.text
            }} inset="inset" primary="by Label"/>
        </MenuItem>
        <MenuItem key={2} selected={sort.by === 'weight'} onClick={() => this.props.sortHashtagList('weight', oppositeDirection)} className={classes.menuItem}>
          <ListItemIcon className={classes.icon}>
            {weightIcon}
          </ListItemIcon>
          <ListItemText classes={{
              text: classes.text
            }} inset="inset" primary="by Weight"/>
        </MenuItem>
      </Menu>
    </div>);
  }
}

function mapStateToProps(state) {
  return {sort: state.ui.sortHashtagList, sortHLAnchorEl: state.ui.sortHLAnchorEl}
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    sortHashtagList: sortHashtagList,
    toggleSortHL: toggleSortHL
  }, dispatch)
}

export default compose(withStyles(styles, {withTheme: true}), connect(mapStateToProps, mapDispatchToProps,),)(SortHLMenu);
