import React from 'react';
import {bindActionCreators, compose} from "redux";
import {connect} from "react-redux";
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import keycode from 'keycode';
import Table, {TableBody, TableCell, TableFooter, TablePagination, TableRow} from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import Checkbox from 'material-ui/Checkbox';
import Tooltip from 'material-ui/Tooltip';
import RemoveIcon from 'material-ui-icons/Delete';
import {withTracker} from 'meteor/react-meteor-data';
import moment from 'moment';
import HistoryTableHeader from './HistoryTableHeader'
// import historyTableToolbar from './historyTableToolbar'
import ViewIcon from 'material-ui-icons/Visibility';

import {HistoryJobs} from '../../api/tweets';
import {deleteHistory} from "../actions/JobsActions";
import {showHistory} from "../actions/HashtagGraphActions";

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3
  },
  table: {
    minWidth: 800,
    maxWidth: 1800
  },
  tableWrapper: {
    overflowX: 'auto',
    overflowY: 'auto',
    minWidth: 800,
    maxWidth: 1800
  }
});

class HistoryTable extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      order: 'asc',
      orderBy: 'id',
      selected: [],
      page: 0,
      rowsPerPage: 5,
      data: {}
    };
  }

  _buildDisplay(e, isFull) {
    let res = '';
    if (Array.isArray(e) && e.length != 0) {
      const le = e.length;
      let i = 0;
      for (i = 0; i < le - 1; i++) {
        res += e[i] + ',';
        if (i > 5 && !isFull) 
          break;
        }
      if (!isFull && i != le - 1) {
        res += '..., ';
      }
      res += e[le - 1];
    } else {
      res = e;
    }
    return res;
  }

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }
    console.log(this.state);
    const data = order === 'desc'
      ? this.state.data.sort((a, b) => (
        b[orderBy] < a[orderBy]
        ? -1
        : 1))
      : this.state.data.sort((a, b) => (
        a[orderBy] < b[orderBy]
        ? -1
        : 1));

    this.setState({data, order, orderBy});
  };

  handleSelectAllClick = (event, checked) => {
    if (checked) {
      this.setState({
        selected: this.state.data.map(n => n.id)
      });
      return;
    }
    this.setState({selected: []});
  };

  handleKeyDown = (event, id) => {
    if (keycode(event) === 'space') {
      this.handleClick(event, id);
    }
  };

  handleClick = (event, id) => {
    const {selected} = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1),);
    }

    this.setState({selected: newSelected});
  };

  handleChangePage = (event, page) => {
    this.setState({page});
  };

  handleChangeRowsPerPage = event => {
    this.setState({rowsPerPage: event.target.value});
  };

  _generateActions(id) {
    return (<div>
      <Tooltip placement="bottom" title="Delete">
        <IconButton onClick={() => this.props.deleteHistory(id)}>
          <RemoveIcon/>
        </IconButton>
      </Tooltip>
      <Tooltip placement="bottom" title="View graph">
        <IconButton onClick={() => this.props.showHistory(id)}>
          <ViewIcon/>
        </IconButton>
      </Tooltip>
    </div>);
  }

  isSelected = id => this.state.selected.indexOf(id) !== -1;

  render() {
    const {history, classes} = this.props;
    this.state.data = history;
    const {order, orderBy, selected, rowsPerPage, page} = this.state;

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, history.length - page * rowsPerPage);

    return (<Paper className={classes.root}>
      {/* <historyTableToolbar numSelected={selected.length}/> */}
      <div className={classes.tableWrapper}>
        <Table className={classes.table}>
          <HistoryTableHeader numSelected={selected.length} order={order} orderBy={orderBy} onSelectAllClick={this.handleSelectAllClick} onRequestSort={this.handleRequestSort} rowCount={history.length}/>
          <TableBody>
            {
              history.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(n => {
                const isSelected = this.isSelected(n._id);
                const created = moment(n.created).fromNow();
                return (<TableRow hover={true}
                  // onKeyDown={event => this.handleKeyDown(event, n._id)}
                  role="checkbox" aria-checked={isSelected} tabIndex={-1} key={n._id} selected={isSelected}>
                  <TableCell padding="checkbox" onClick={event => this.handleClick(event, n._id)}>
                    <Checkbox checked={isSelected}/>
                  </TableCell>
                  <TableCell padding="none">{n._id}</TableCell>
                  <TableCell padding="checkbox">{n.query}</TableCell>
                  <TableCell padding="checkbox">{n.username}</TableCell>
                  <TableCell padding="checkbox">{n.count}</TableCell>
                  <TableCell padding="checkbox">
                    <a href="javascript:" style={{
                        cursor: "default",
                        color: "black",
                        textDecoration: "none"
                      }} title={this._buildDisplay(n.freewordList, true)}>{this._buildDisplay(n.freewordList, false)}</a>
                  </TableCell>
                  <TableCell padding="checkbox">{created}</TableCell>
                  <TableCell padding="checkbox" style={{
                      minWidth: '100px'
                    }}>{this._generateActions(n._id)}</TableCell>
                </TableRow>);
              })
            }
            {
              emptyRows > 0 && (<TableRow style={{
                  height: 49 * emptyRows
                }}>
                <TableCell colSpan={6}/>
              </TableRow>)
            }
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination count={history.length} rowsPerPage={rowsPerPage} page={page} onChangePage={this.handleChangePage} onChangeRowsPerPage={this.handleChangeRowsPerPage}/>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </Paper>);
  }
}

HistoryTable.propTypes = {
  classes: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {}
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    deleteHistory: deleteHistory,
    showHistory: showHistory
  }, dispatch)
}

export default compose(withTracker((props) => {
  Meteor.subscribe('historyJobs');

  return {history: HistoryJobs.find({}).fetch()};
}), withStyles(styles, {withTheme: true}), connect(mapStateToProps, mapDispatchToProps,),)(HistoryTable);
