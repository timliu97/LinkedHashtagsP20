
import React, {Component} from 'react';
import {bindActionCreators, compose} from 'redux';
import {connect} from 'react-redux';
import {withStyles} from 'material-ui/styles';
import PropTypes from 'prop-types';
import ImportIcon from 'material-ui-icons/FileUpload';
import {ListItem, ListItemIcon, ListItemText} from 'material-ui/List';
import PersonIcon from 'material-ui-icons/Person';
import InfoIcon from 'material-ui-icons/Info';
import Avatar from 'material-ui/Avatar';
import {withTracker} from 'meteor/react-meteor-data';
import {toggleAccountForm, toggleInfoDialog, toggleUpgrade} from '../actions/UIActions';
import Tooltip from 'material-ui/Tooltip';
import LockIcon from 'material-ui-icons/Lock';
import {meteor} from 'meteor/meteor';
import {uploadFile} from "../actions/HashtagGraphActions";
import {refreshGraph} from "../actions/HashtagGraphActions";
import {resetHashtagGraph, upload} from "../actions/HashtagGraphActions";
import LockOpenIcon from 'material-ui-icons/LockOpen';
import Button from 'material-ui/Button';
import FeedbackIcon from 'material-ui-icons/Feedback';
import {showHistory} from "../actions/HashtagGraphActions";
import {Meteor} from "meteor/meteor";
import {chooseFile, toggleImportDialog} from "../actions/UIActions";
import {confinement} from '../../Demo/confinement.js';
import {the_voice} from '../../Demo/theVoice.js';
import {prayforkyoani} from '../../Demo/prayforkyoani.js';
import {demoData} from '../../Demo/DemoData.js';
import file from '../../Demo/confinement.json'


const styles = theme => ({
  avatar: {
    width: 24,
    height: 24,
    flexShrink: 0,
    marginRight: 16,
    fontSize: 13,
    backgroundColor: theme.palette.primary.main
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
  hide: {
    visibility: 'hidden'
  },
  show: {
    visibility: 'visible',
    left: '-3px!important'
  }
});

class otherTools extends Component {
/*
random(theVoice, macron, prayforkyoani,demoData){
    const number = 3;
    import {uploadFile} from "../actions/HashtagGraphActions";
    const randomNumber = parseInt(Math.random()*number);
    if(randomNumber == 0){
        demoData = theVoice;}
    if(randomNumber == 1){
        demoData = macron;}
    if(randomNumber == 2){
        demoData = prayforkyoani;}
    else{
        demoData = demoData;}
    console.log(randomNumber);
    console.log(demoData);
    uploadFile(demoData);
    }
*/
    switch(boolean){
    if(boolean == true){
    boolean = false;
    }else{
    boolean = true;}
    }
  render() {
    const {toolbarOpen, currentUser, classes, isUserAdmin, chooseFile, uploadFile, upload} = this.props;
    let accountItemIcon = null;
    let accountText = null;
    if (currentUser) {
      accountItemIcon = <Avatar className={classes.avatar}>{currentUser.profile.firstname.charAt(0)}</Avatar>;
      accountText = currentUser.profile.firstname + " " + currentUser.profile.lastname;
    } else {
      accountItemIcon = <PersonIcon/>;
      accountText = "Sign In";
    }
    const tooltipUserText = (currentUser)
      ? 'Profile'
      : 'Sign In';

    return (<div>
{/*
 <Button onClick={() => resetHashtagGraph()} raised={true} classes={{
                root: classes.button,
                label: classes.label
              }}>
              <FeedbackIcon className={classes.iconUp}/>
              <span className={classes.btnText}>Demo</span>
            </Button>

*/}
<Button onClick={() => upload(the_voice, confinement, prayforkyoani, demoData)} raised={true}  classes={{
                root: classes.button,
                label: classes.label
              }}>
              <FeedbackIcon className={classes.iconUp}/>
              <span className={classes.btnText}>Demo</span>
    </Button>

<Tooltip placement="top" title={tooltipUserText} classes={{
          popper: toolbarOpen
            ? classes.hide
            : classes.show
        }}>
        <ListItem button={true}>
        {//<ListItem button={true} onClick={()=> this.props.toggleAccountForm(true)}>
        }
          <ListItemIcon>
            {accountItemIcon}
          </ListItemIcon>
          <ListItemText primary={accountText}/>
        </ListItem>
      </Tooltip>

      <Tooltip placement="top" title='About' classes={{
          popper: toolbarOpen
            ? classes.hide
            : classes.show
        }}>
        <ListItem button={true} onClick={() => this.props.ImportDialogOpen||this.props.toggleInfoDialog(true)}>
          <ListItemIcon>
            <InfoIcon/>
          </ListItemIcon>
          <ListItemText primary="About"/>
        </ListItem>
      </Tooltip>
    </div>);
  }
}

otherTools.propTypes = {
  classes: PropTypes.object.isRequired
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    toggleAccountForm: toggleAccountForm,
    toggleInfoDialog: toggleInfoDialog,
    toggleImportDialog: toggleImportDialog,
    toggleUpgrade: toggleUpgrade,
    showHistory: showHistory,
    uploadFile: uploadFile,
    refreshGraph: refreshGraph,
    resetHashtagGraph: resetHashtagGraph,
    toggleImportDialog: toggleImportDialog,
    upload: upload
  }, dispatch)
}

function mapStateToProps(state) {
  return {importDialogOpen: state.ui.importDialogOpen}
}



export default compose(withTracker((props) => {
  const currentUser = Meteor.user();
  const userId = Meteor.userId();

  return {currentUser,
  isUserAdmin: Roles.userIsInRole(userId,'admin'),
 }
}), withStyles(styles), connect(mapStateToProps, mapDispatchToProps,),)(otherTools)
