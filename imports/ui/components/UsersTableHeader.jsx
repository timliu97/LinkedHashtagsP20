import React from "react";
import PropTypes from 'prop-types';
import {TableCell, TableHead, TableRow, TableSortLabel} from 'material-ui/Table';
import Tooltip from 'material-ui/Tooltip';
import Checkbox from 'material-ui/Checkbox';

const columnData = [
  {
    id: 'id',
    numeric: false,
    disablePadding: true,
    label: 'id'
  }, {
    id: 'name',
    numeric: false,
    disablePadding: false,
    label: 'Name'
  }, {
    id: 'email',
    numeric: false,
    disablePadding: false,
    label: 'Email'
  }, {
    id: 'roles',
    numeric: false,
    disablePadding: false,
    label: 'Roles'
  }, {
    id: 'createdAt',
    numeric: false,
    disablePadding: false,
    label: 'Created'
  }, {
    id: 'actions',
    numeric: false,
    disablePadding: false,
    label: 'Actions'
  }
];

class UsersTableHeader extends React.Component {
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
                ? 'none'
                : 'default'} sortDirection={orderBy === column.id
                ? order
                : false}>
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

export default UsersTableHeader;
