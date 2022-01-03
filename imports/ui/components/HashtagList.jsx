import React, {Component} from 'react';
import {bindActionCreators, compose} from 'redux';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {withStyles} from 'material-ui/styles';
import List, {ListItem, ListItemSecondaryAction, ListItemText} from 'material-ui/List';
import Checkbox from 'material-ui/Checkbox';
import IconButton from 'material-ui/IconButton';
import HideIcon from 'material-ui-icons/Close';
import ShowIcon from 'material-ui-icons/Add';
import HighlightIcon from 'material-ui-icons/Toll';
import {
  hideHashtag,
  highlightHashtag,
  selectHashtag,
  toggleHideSelected,
  toggleHighlightSelected,
  toggleSelectAll
} from "../actions/HashtagGraphActions";
import {FormControlLabel} from 'material-ui/Form';
import {CircularProgress} from 'material-ui/Progress';
import Tooltip from 'material-ui/Tooltip';

const styles = theme => ({
  root: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    background: theme.palette.background.paper,
    height: 'calc(100% - 128px)',
    overflowY: 'scroll'
  },
  hiddenHashtag: {
    textDecoration: "line-through"
  },
  listToolbar: {
    ...theme.mixins.toolbar,
    display: 'flex',
    position: 'fixed',
    width: 400,
    boxSizing: 'border-box',
    top: 64,
    padding: '8px 16px',
    paddingLeft: 30,
    paddingRight: 23,
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
    backgroundColor: '#fff',
    zIndex: 1
  },
  countLabel: {
    paddingLeft: theme.spacing.unit * 2
  },
  actionButtons: {
    display: 'flex',
    marginLeft: 'auto'
  },
  progressContainer: {
    position: 'fixed',
    width: 400,
    height: 'calc(100% - 128px)',
    textAlign: 'center',
    margin: 0,
    backgroundColor: 'rgba(255,255,255,0.7)',
    zIndex: 9,
    padding: '10% 0',
    boxSizing: 'border-box'
  },
  progress: {
    width: 50,
    height: 50
  }
});

class HashtagList extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      page: 0,
      rowsPerPage: 20
    };
  }

  createListItems() {
    const {hashtagList, hiddenHashtags, highlightedHashtags, sort, classes} = this.props;
    const {rowsPerPage, page} = this.state;

    const sortOperators = {
      'label': {
        'asc': function(a, b) {
          return (a.label > b.label)
            ? 1
            : (
              (b.label > a.label)
              ? -1
              : 0)
        },
        'desc': function(a, b) {
          return (a.label < b.label)
            ? 1
            : (
              (b.label < a.label)
              ? -1
              : 0)
        }
      },
      'weight': {
        'asc': function(a, b) {
          return a.weight - b.weight;
        },
        'desc': function(a, b) {
          return b.weight - a.weight;
        }
      }
    };
    let x;
    if (sort.by) {
      x = [].concat(hashtagList).sort(sortOperators[sort.by][sort.direction]);
    } else {
      x = [].concat(hashtagList);
    }

    return x.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((hashtag) => {
      const isHidden = hiddenHashtags.indexOf(hashtag.id) !== -1;
      const isHighlighted = highlightedHashtags.indexOf(hashtag.id) !== -1;

      let hideButton = null;
      let highlightColor = 'default';
      let highlightTooltipText = 'Highlight';
      if (isHighlighted) {
        highlightColor = 'accent';
        highlightTooltipText = 'Tone Down';
      }

      let highlightButton = <Tooltip placement="bottom" title={highlightTooltipText}>
        <IconButton aria-label="Highlight" onClick={() => this.props.highlightHashtag(hashtag.id)} color={highlightColor}>
          <HighlightIcon/>
        </IconButton>
      </Tooltip>;
      if (isHidden) {
        hideButton = <Tooltip placement="bottom" title="Show">
          <IconButton aria-label="show" onClick={() => this.props.hideHashtag(hashtag.id)}>
            <ShowIcon/>
          </IconButton>
        </Tooltip>;
      } else {
        hideButton = <Tooltip placement="bottom" title="Hide">
          <IconButton aria-label="hide" onClick={() => this.props.hideHashtag(hashtag.id)}>
            <HideIcon/>
          </IconButton>
        </Tooltip>;
      }
      return (<ListItem key={hashtag.id} dense={true} button={true} onClick={() => this.props.selectHashtag(hashtag.id)} className={classNames(isHidden && classes.hiddenHashtag)}>
        <Checkbox checked={this.props.selectedHashtags.indexOf(hashtag.id) !== -1} tabIndex={-1} disableRipple={true}/>
        <ListItemText primary={hashtag.label} secondary={"Weight: " + hashtag.weight}/>
        <ListItemSecondaryAction>
          {highlightButton}
          {hideButton}
        </ListItemSecondaryAction>
      </ListItem>);
    });
  }

  render() {
    const {selectedHashtags, numberOfHashtags, classes} = this.props;

    const countSelected = selectedHashtags.length;

    let indeterminate = false;
    if (countSelected > 0 && countSelected < numberOfHashtags) {
      indeterminate = true;
    }

    return (<div className={classes.root}>
      <div className={classes.listToolbar}>
        <FormControlLabel control={<Checkbox
          checked = {
            countSelected === numberOfHashtags
          }
          onClick = {
            () => this.props.selectAllHashtags()
          }
          indeterminate = {
            indeterminate
          }
          />} label={countSelected + " Selected"} classes={{
            label: classes.countLabel
          }}/>
        <div className={classes.actionButtons}>
          <Tooltip placement="bottom" title="Highlight/Tone Down Selected">
            <div>
              <IconButton aria-label="Highlight Selected" color="primary" disabled={countSelected === 0} onClick={() => this.props.toggleHighlightSelected()}>
                <HighlightIcon/>
              </IconButton>
            </div>
          </Tooltip>
          <Tooltip placement="bottom" title="Hide/Show Selected">
            <div>
              <IconButton aria-label="Hide Selected" color="primary" disabled={countSelected === 0} onClick={() => this.props.toggleHideSelected()}>
                <HideIcon/>
              </IconButton>
            </div>
          </Tooltip>
        </div>
      </div>
      {
        this.props.loading && <div className={classes.progressContainer}>
            <CircularProgress className={classes.progress} color="primary" size={50} thickness={4}/>
          </div>
      }
      <List>
        {this.createListItems()}
        {}</List>
    </div>);
  }
}

HashtagList.propTypes = {
  classes: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    hashtagList: state.hashtagGraph.graphData.nodes,
    selectedHashtags: state.hashtagGraph.selected,
    highlightedHashtags: state.hashtagGraph.highlighted,
    hiddenHashtags: state.hashtagGraph.hidden,
    numberOfHashtags: state.hashtagGraph.graphMetadata.numberOfNodes,
    loading: state.ui.loading,
    sort: state.ui.sortHashtagList
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    selectHashtag: selectHashtag,
    highlightHashtag: highlightHashtag,
    hideHashtag: hideHashtag,
    selectAllHashtags: toggleSelectAll,
    toggleHighlightSelected: toggleHighlightSelected,
    toggleHideSelected: toggleHideSelected
  }, dispatch)
}

export default compose(withStyles(styles, {withTheme: true}), connect(mapStateToProps, mapDispatchToProps,),)(HashtagList);
