import React, {Component} from 'react';
import {bindActionCreators, compose} from 'redux';
import {connect} from 'react-redux';
import {withStyles} from "material-ui/styles";
import PropTypes from 'prop-types';
import {ListItem, ListItemIcon, ListItemText} from 'material-ui/List';
import ImportIcon from 'material-ui-icons/FileUpload';
import UsersIcon from 'material-ui-icons/Group';
import {toggleImportDialog, toggleUsersDialog} from "../actions/UIActions";
import Tooltip from 'material-ui/Tooltip';
import {Meteor} from "meteor/meteor";
import {resetEdgeData} from "../actions/HashtagGraphActions";
import {resetCurrentJob} from "../actions/HashtagGraphActions";
import FeedbackIcon from 'material-ui-icons/Feedback';
import {showHistory} from "../actions/HashtagGraphActions";
import {withTracker} from 'meteor/react-meteor-data';
import Button from 'material-ui/Button';
import {confinement} from '../../Demo/confinement.js';
import {the_voice} from '../../Demo/theVoice.js';
import {prayforkyoani} from '../../Demo/prayforkyoani.js';
import {demoData} from '../../Demo/DemoData.js';
import {resetHashtagGraph, uploadFile} from "../actions/HashtagGraphActions";


const styles = theme => ({
hide: {
    visibility: 'hidden'
  },
    buttonsContainer: {
    display: 'flex',
    marginTop: theme.spacing.unit * 2
  },
  button: {
    margin: '0px',
    background: 'linear-gradient(45deg, #9295FC 30%, #E5A4F8 90%)',
    borderRadius: 3,
    border: 0,
    minWidth: '60px',
    color: 'white',
    padding: '0px 0px',
    boxShadow: '0 3px 5px 2px rgba(170, 105, 255, .30)',
    flexGrow: 1,
    flexDirection: 'row'
  },
  label: {
    display: 'flex',
    flexDirection: 'column'
  },
  iconUp: {
    flexGrow: 1,
    //marginBottom: theme.spacing.unit
  },
  btnText: {
    flexGrow: 1
  },
  show: {
    visibility: 'visible',
    left: '-3px!important'
  }
});
class graphTools extends Component {

  render() {
    const {isUserAdmin, toolbarOpen, classes, isUserResearcher, resetHashtagGraph, uploadFile} = this.props;
    return (

    <div>
    {/*
    <Button onClick={() => resetHashtagGraph()} classes={{
                root: classes.button,
                label: classes.label
              }}>
              <FeedbackIcon className={classes.iconUp}/>
              <span className={classes.btnText}>Reset</span>
</Button>

<Tooltip placement="bottom" title={'Import'} classes={{
          popper: toolbarOpen
            ? classes.hide
            : classes.show
        }}>
        <ListItem button={true} onClick={() => this.props.toggleImportDialog(true)}>
          <ListItemIcon>
            <ImportIcon/>
          </ListItemIcon>
          <ListItemText primary="Import Graph"/>
        </ListItem>
      </Tooltip>

{
        isUserAdmin && <Tooltip placement="bottom" title={'Users'} classes={{
              popper: toolbarOpen
                ? classes.hide
                : classes.show
            }}>
            <ListItem button={true} onClick={() => this.props.toggleUsersDialog(true)}>
              <ListItemIcon>
                <UsersIcon/>
              </ListItemIcon>
              <ListItemText primary="Users"/>
            </ListItem>
          </Tooltip>
}
*/}
    </div>

    );
}
}
graphTools.propTypes = {
  classes: PropTypes.object.isRequired
};
function mapStateToProps(state) {
  return {importDialogOpen: state.ui.importDialogOpen, file: state.ui.file}
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    toggleImportDialog: toggleImportDialog,
    toggleUsersDialog: toggleUsersDialog,
    showHistory: showHistory,
    uploadFile: uploadFile,
    resetHashtagGraph: resetHashtagGraph,
resetEdgeData: resetEdgeData,
resetCurrentJob: resetCurrentJob

  }, dispatch)
}

export default compose(withTracker(() => {
  const userId = Meteor.userId();
  return {
    currentUser: userId,
    isUserAdmin: Roles.userIsInRole(userId, 'admin'),
    isUserResearcher: Roles.userIsInRole(userId, 'researcher')
  }
}), withStyles(styles), connect(null, mapDispatchToProps,),)(graphTools)
