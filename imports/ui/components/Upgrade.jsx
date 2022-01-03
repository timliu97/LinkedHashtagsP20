import React, {Component} from 'react';
import {bindActionCreators, compose} from 'redux';
import {withStyles} from 'material-ui/styles';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Dialog, {DialogActions, DialogContent, DialogContentText, DialogTitle, withMobileDialog} from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import {withTracker} from 'meteor/react-meteor-data';
import {meteor} from 'meteor/meteor';
import CloseIcon from 'material-ui-icons/Close';
import Slide from 'material-ui/transitions/Slide';
import {toggleUpgrade} from "../actions/UIActions";
import Table, {TableBody, TableCell, TableHead, TableRow} from 'material-ui/Table';

const styles = theme => ({
  root: {
    color: theme.palette.primary[500],
    textDecoration: 'inherit',
    '&:hover': {
      textDecoration: 'underline'
    }
  },
  button: {
    margin: theme.spacing.unit,
    position: 'absolute',
    top: 0,
    right: 0
  },
  aboutContent: {
    padding: 0
  },
  aboutText: {
    fontSize: '0.9rem',
    padding: theme.spacing.unit * 2,
    paddingBottom: 0,
    textAlign: 'center'
  },
  aboutTextCredit: {
    fontSize: '0.9rem',
    padding: theme.spacing.unit * 2,
    paddingTop: 0,
    textAlign: 'center'
  },
  tableInfoText: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center'
  }
});

let id = 0;

function createData(operator, signification) {
  id += 1;
  return {id, operator, signification};
}

const data = [
  createData('#hashtag', 'containing the hashtag "hashtag"'),
  createData('#hashtag -RT', 'containing "hashtag" exclude retweets'),
  createData('#hashtag1 #hashtag2', 'containing both hashtags hashtag1 and hashtag2'),
  createData('#hashtag1 OR #hashtag2', 'containing either hashtag hashtag1 or hashtag2 (or both)'),
  createData('#hashtag1 -#hashtag2', 'containing “hashtag1” but not "hashtag2"')
];

function MyLink(props) {
  const {
    children,
    classes,
    className,
    variant,
    sheet,
    theme,
    ...other
  } = props;

  return (<a target="_blank" className={classNames(classes.root, className)} {...other}>
    {children}
  </a>);
}

const MyLinkStyled = withStyles(styles)(MyLink);

function Transition(props) {
  return <Slide direction="down" {...props}/>;
}

class Upgrade extends Component {

  render() {
    const {fullScreen, classes, isUserGuest, isUserAdmin, isUserResearcher, isUserSup, currentUser, profile} = this.props;
    let user = Meteor.user();
    if(currentUser){
    let profile = currentUser.profile;
    }
    return (<Dialog open={this.props.upgradeOpen} onClose={() => this.props.toggleUpgrade(false)}>
      <DialogTitle>Upgrade your profile</DialogTitle>
      <DialogContent>{
      isUserAdmin
      ?
        <DialogContentText>
          You are currently an admin.
        </DialogContentText>
      : isUserSup
         ?<DialogContentText>
          You are currently an advanced user, ask admin to become admin.
        </DialogContentText>
         : isUserResearcher
            ?<DialogContentText>
             You are currently a basic user, ask admin to become advanced user.
             </DialogContentText>
            : <DialogContentText>
                  You are currently a Guest user, create your account for more features.
                 </DialogContentText>
      }
      </DialogContent>
      <DialogActions>
        <Button onClick={() => this.props.toggleUpgrade(false)} color="default">
          Cancel
        </Button>{
        isUserAdmin
        ?
        /*<form action="MAILTO:qishu.liu@utt.fr" method="post" enctype="text/plain">
        UserName:{profile.firstname + " " + profile.lastname}
        wants to upgrade his profile.
        <Button type="submit" raised={true} color="primary">
        Ask for permission
        </Button>
        </form>*/<a href="mailto:qishu.liu@utt.fr?subject=Demand for permission&body=UserName:           Demand to become:">Ask for permission</a>
            :''

        }
      </DialogActions>
    </Dialog>);
  }
}

Upgrade.propTypes = {
  fullScreen: PropTypes.bool.isRequired
};

function mapStateToProps(state) {
  return {upgradeOpen: state.ui.upgradeOpen}
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    toggleUpgrade: toggleUpgrade
  }, dispatch)
}

export default compose(withTracker(() =>{
const userId = Meteor.userId();
return{
currentUser: userId,
isUserGuest: Roles.userIsInRole(userId, 'guest'),
    isUserResearcher: Roles.userIsInRole(userId, 'researcher'),
    isUserAdmin: Roles.userIsInRole(userId, 'admin'),
    isUserSup: Roles.userIsInRole(userId,'superuser')
}
}),withMobileDialog(), withStyles(styles), connect(mapStateToProps, mapDispatchToProps,),)(Upgrade);
