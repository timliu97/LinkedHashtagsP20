import React, {Component} from 'react';
import {bindActionCreators, compose} from "redux";
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import Dialog, {withMobileDialog} from "material-ui/Dialog";
import {Meteor} from "meteor/meteor";
import {withTracker} from 'meteor/react-meteor-data';
import Button from 'material-ui/Button';
import {ListItemText} from 'material-ui/List';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import Typography from 'material-ui/Typography';
import CloseIcon from 'material-ui-icons/Close';
import {toggleUsersDialog} from "../actions/UIActions";
import {connect} from "react-redux";
import {FormControl} from 'material-ui/Form';
import Input, {InputLabel} from 'material-ui/Input';
import Select from 'material-ui/Select';
import Checkbox from 'material-ui/Checkbox';
import {MenuItem} from 'material-ui/Menu';
import moment from "moment/moment";
import Table, {TableBody, TableCell, TableFooter, TablePagination, TableRow} from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import UsersTableHeader from "./UsersTableHeader";
import UsersTableToolbar from "./UsersTableToolbar";
import Tooltip from 'material-ui/Tooltip';
import RemoveIcon from 'material-ui-icons/Delete';
import {blueGrey} from 'material-ui/colors';
import Fade from 'material-ui/transitions/Fade';
import {toggleUserRole} from "../actions/UsersActions";

const styles = theme => ({
  root: {
    backgroundColor: blueGrey['50']
  },
  rootPaper: {
    width: '80%',
    margin: 'auto',
    marginTop: theme.spacing.unit * 3,
    [theme.breakpoints.down('md')]: {
      width: '100%'
    }
  },
  appBar: {
    position: 'relative'
  },
  flex: {
    flex: 1
  },
  formControl: {
    margin: theme.spacing.unit,
    width: '100%'
  }
});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};

class UsersDialog extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      order: 'asc',
      orderBy: 'id',
      selected: [],
      page: 0,
      rowsPerPage: 5,
      role: new Set(), // immutableJS would be better in a real app
    }
  }

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

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

  isSelected = id => this.state.selected.indexOf(id) !== -1;

  _generateRolesSelect(user) {
    const {roles, currentUser, classes} = this.props;

    if (user._id === currentUser || Roles.userIsInRole(user._id, 'superuser')) {
      return (user.roles.join(', '));
    } else {
      return (<FormControl className={classes.formControl}>
        <InputLabel htmlFor="role-multiple">Roles</InputLabel>
        <Select multiple={true} value={[...user.roles]} onChange={(event) => Meteor.call('users.handleRoles', user._id, event.target.value)} input={<Input id = "tag-multiple" />} renderValue={selected => selected.join(', ')} MenuProps={MenuProps}>
          {
            roles.map(role => (<MenuItem key={role} value={role}>
              <Checkbox checked={Roles.userIsInRole(user._id, role)}/>
              <ListItemText primary={role}/>
            </MenuItem>))
          }
        </Select>
      </FormControl>);
    }
  }

  _generateUserActions(user) {
    const {currentUser} = this.props;

    if (user._id === currentUser || Roles.userIsInRole(user._id, 'superuser')) {
      return (<i>no actions</i>);
    }
    return (<Tooltip placement="bottom" title="Delete">
      <IconButton onClick={() => Meteor.call('users.remove', user._id)}>
        <RemoveIcon/>
      </IconButton>
    </Tooltip>)
  }

  render() {
    const {users, usersDialogOpen, toggleUsersDialog, classes} = this.props;
    const {order, orderBy, selected, rowsPerPage, page} = this.state;

    let userList = users
      ? users
      : [];
    const numOfUsers = users
      ? users.length
      : 0;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, numOfUsers - page * rowsPerPage);

    return (<Dialog fullScreen={true} open={usersDialogOpen} onClose={() => toggleUsersDialog(false)} transition={Fade} classes={{
        paper: classes.root, // className, e.g. `OverridesClasses-root-X`
      }}>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton color="inherit" onClick={() => toggleUsersDialog(false)} aria-label="Close">
            <CloseIcon/>
          </IconButton>
          <Typography type="title" color="inherit" className={classes.flex}>
            Users List
          </Typography>
          <Button color="inherit" onClick={() => toggleUsersDialog(false)}>
            save
          </Button>
        </Toolbar>
      </AppBar>
      <Paper className={classes.rootPaper}>
        <UsersTableToolbar numSelected={selected.length}/>
        <div className={classes.tableWrapper}>
          <Table className={classes.table}>
            <UsersTableHeader numSelected={selected.length} order={order} orderBy={orderBy} onSelectAllClick={this.handleSelectAllClick} onRequestSort={this.handleRequestSort} rowCount={numOfUsers}/>
            <TableBody>
              {
                userList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(n => {
                  const isSelected = this.isSelected(n._id);
                  const created = moment(n.createdAt).fromNow();
                  return (<TableRow hover={true} role="checkbox" aria-checked={isSelected} tabIndex={-1} key={n._id} selected={isSelected}>
                    <TableCell padding="checkbox" onClick={event => this.handleClick(event, n._id)}>
                      <Checkbox checked={isSelected}/>
                    </TableCell>
                    <TableCell>{n._id}</TableCell>
                    <TableCell padding="none">{n.profile.firstname + ' ' + n.profile.lastname}</TableCell>
                    <TableCell>{n.emails[0].address}</TableCell>
                    <TableCell>{this._generateRolesSelect(n)}</TableCell>
                    <TableCell>{created}</TableCell>
                    <TableCell>{this._generateUserActions(n)}</TableCell>
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
                <TablePagination count={numOfUsers} rowsPerPage={rowsPerPage} page={page} onChangePage={this.handleChangePage} onChangeRowsPerPage={this.handleChangeRowsPerPage}/>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </Paper>
    </Dialog>);
  }
}

UsersDialog.propTypes = {
  classes: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {usersDialogOpen: state.ui.usersDialogOpen, roles: state.users.roles}
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    toggleUsersDialog: toggleUsersDialog,
    toggleUserRole: toggleUserRole
  }, dispatch)
}

export default compose(withTracker(() => {
  const usersHandle = Meteor.subscribe('users');

  if (usersHandle.ready()) {
    const userId = Meteor.userId();
    const users = Meteor.users.find().fetch();

    return {currentUser: userId, users: users}
  }
  return {}
}), withMobileDialog(), withStyles(styles), connect(mapStateToProps, mapDispatchToProps,),)(UsersDialog);
