import React from "react";
import PropTypes from 'prop-types';
import {TableCell, TableHead, TableRow, TableSortLabel} from 'material-ui/Table';
import Tooltip from 'material-ui/Tooltip';
import Checkbox from 'material-ui/Checkbox';

const columnData = [
  {
    id: '_id',
    numeric: false,
    disablePadding: true,
    label: 'Id',
    limitWidth: '120px'
  }, {
    id: 'query',
    numeric: false,
    disablePadding: true,
    label: 'Query',
    limitWidth: '120px'
  }, {
    id: 'username',
    numeric: false,
    disablePadding: true,
    label: 'Username',
    limitWidth: '120px'
  }, {
    id: 'count',
    numeric: false,
    disablePadding: true,
    label: 'Count',
    limitWidth: '90px'
  }, {
    id: 'freewords',
    numeric: false,
    disablePadding: true,
    label: 'Freewords',
    limitWidth: '120px'
  }, {
    id: 'created',
    numeric: false,
    disablePadding: true,
    label: 'Created',
    limitWidth: '100px'
  }, {
    id: 'actions',
    numeric: false,
    disablePadding: true,
    label: 'Actions',
    limitWidth: '150px'
  }
];

class HistoryTableHeader extends React.Component {
  static propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.string.isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired
  };

  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const {onSelectAllClick, order, orderBy, numSelected, rowCount} = this.props;

    return (<TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox indeterminate={numSelected > 0 && numSelected < rowCount} checked={numSelected === rowCount} onChange={onSelectAllClick}/>
        </TableCell>
        {
          columnData.map(column => {
            return (<TableCell key={column.id} numeric={column.numeric} padding={column.disablePadding
                ? 'checkbox'
                : 'default'} sortDirection={orderBy === column.id
                ? order
                : false} style={{
                maxWidth: column.limitWidth
              }}>
              <Tooltip title="Sort" placement={column.numeric
                  ? 'bottom-end'
                  : 'bottom-start'} enterDelay={300}>
                <TableSortLabel active={orderBy === column.id} direction={order} onClick={this.createSortHandler(column.id)}>
                  {column.label}
                </TableSortLabel>
              </Tooltip>
            </TableCell>);
          }, this)
        }
      </TableRow>
    </TableHead>);
  }
}

export default HistoryTableHeader;
