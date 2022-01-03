import React from "react";
import classNames from 'classnames';
import {withStyles} from "material-ui/styles";
import PropTypes from 'prop-types';
import FilterListIcon from 'material-ui-icons/FilterList';
import Tooltip from 'material-ui/Tooltip';
import IconButton from 'material-ui/IconButton';
import DeleteIcon from 'material-ui-icons/Delete';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';



const styles = theme => ({
  root: {
    paddingRight: 2
  },
  highlight: theme.palette.type === 'light'
    ? {
      color: theme.palette.secondary.A700,
      backgroundColor: theme.palette.secondary.A100
    }
    : {
      color: theme.palette.secondary.A100,
      backgroundColor: theme.palette.secondary.A700
    },
  spacer: {
    flex: '1 1 100%'
  },
  actions: {
    color: theme.palette.text.secondary
  },
  title: {
    flex: '0 0 auto'
  }
});

class JobsTableToolbar extends React.Component {
  render() {

    const {numSelected, classes} = this.props;

    return (<Toolbar className={classNames(classes.root, {
        [classes.highlight]: numSelected > 0
      })}>
      <div className={classes.title}>
        {
          numSelected > 0
            ? (<Typography type="subheading">{numSelected}
              selected</Typography>)
            : (<Typography type="title">Jobs</Typography>)
        }
      </div>
      <div className={classes.spacer}/>
      <div className={classes.actions}>
        {
          numSelected > 0
            ? (<Tooltip title="Delete">
              <IconButton aria-label="Delete">
                <DeleteIcon/>
              </IconButton>
            </Tooltip>)
            : (<Tooltip title="Filter list">
              <IconButton aria-label="Filter list">
                <FilterListIcon/>
              </IconButton>
            </Tooltip>)
        }
      </div>
    </Toolbar>);
  }
}

JobsTableToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired
};

export default withStyles(styles)(JobsTableToolbar);
