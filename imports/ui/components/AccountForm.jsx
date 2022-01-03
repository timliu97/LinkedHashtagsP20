import React, {Component} from 'react';
import Button from 'material-ui/Button';
import {bindActionCreators, compose} from 'redux';
import {connect} from 'react-redux';
import {Field, reduxForm} from 'redux-form';
import {TextField} from 'redux-form-material-ui';
import {withStyles} from 'material-ui/styles';
import {withTracker} from 'meteor/react-meteor-data';
import Dialog, {DialogActions, DialogContent, DialogContentText, DialogTitle, withMobileDialog} from 'material-ui/Dialog';
import {changePassword, createUser, logInUser, logoutUser, changeApiKey} from "../actions/AccountActions";
import {switchAccountForm, toggleAccountForm} from "../actions/UIActions";

const styles = theme => ({
  formControl: {
    display: 'flex'
  },
  firstName: {
    width: '48%',
    marginRight: 'auto'
  },
  lastName: {
    width: '48%',
    marginLeft: 'auto'
  }
});

class AccountForm extends Component {
    /*state={isSignInTwitter: false}
    uiConfig = {
    signInFlow: "popup",
    signInOptions: [
    firebase.auth.TwitterAuthProvider.PROVIDER_ID,
    ],
    callbacks:{
    signInSuccess: ()=>false}
    }*/
  constructor(props) {
    super(props);
    this.state = {
      init: false
    };
  }
    popoutMDP(){
    window._sigma.refresh({skipIndexation: true});
      alert('Vous avez bien changé votre mot de passe');
    }
    popoutAPI(){
    window._sigma.refresh({skipIndexation: true});
      alert('Vous avez bien changé l\'API');
    }
  componentWillReceiveProps(nextProps) {
    const currentUser = nextProps.currentUser;
    if (!this.state.init && currentUser) {
      let profile = currentUser.profile;
      this.props.initialize(profile);
      this.setState({init: true});
    }
  }

  render() {
    const {
      currentUser,
      logInUser,
      createUser,
      accountFormDialogOpen,
      switchAccountForm,
      isSignInForm,
      handleSubmit,
      pristine,
      reset,
      submitting,
      classes,
      isUserSup,
      isUserAdmin,
      isUserResearcher
    } = this.props;
    let user = Meteor.user();
    let renderAccount = null;
    if (currentUser) {
      let profile = currentUser.profile;
      cardTitle = 'Profile';
      renderAccount = <DialogContent>
        <form onSubmit={handleSubmit((values => this.props.changePassword(values)))}>
          <DialogContentText>
            Welcome, {profile.firstname + " " + profile.lastname}, you can change your password here.
          </DialogContentText>
          <Field name="oldPassword" type="password" component={TextField} label="Old Password" fullWidth={true} margin="normal"/>
          <Field name="newPassword" type="password" component={TextField} label="New Password" fullWidth={true} margin="normal"/>
          <DialogActions>
            <Button type="submit" raised={true} color="primary" onClick={() => this.popoutMDP()}>
              Change Password
            </Button>
            <Button onClick={() => this.props.logoutUser()} color="default">
              Logout
            </Button>
          </DialogActions>
        </form>{
        isUserAdmin
        ?<form onSubmit={handleSubmit((values => this.props.changeApiKey(values)))}>
          <DialogContentText>
            You can set your tweet API key here.
          </DialogContentText>
          <Field name="consumer_key" type="text" component={TextField} label="consumer_key" fullWidth={true} margin="normal"/>
          <Field name="consumer_secret" type="text" component={TextField} label="consumer_secret" fullWidth={true} margin="normal"/>
          <Field name="access_token" type="text" component={TextField} label="access_token" fullWidth={true} margin="normal"/>
          <Field name="access_token_secret" type="text" component={TextField} label="access_token_secret" fullWidth={true} margin="normal"/>
          <DialogActions>
            <Button type="submit" raised={true} color="primary" onClick={() => this.popoutAPI()}>
              Add/Change Tweet API key
            </Button>
          </DialogActions>
        </form>
        :''
        }

      </DialogContent>
    } else {
      let actions = {};
      let formDescription = null;
      let onSubmit = null;
      if (isSignInForm) {
        cardTitle = "Sign In";
        formDescription = "Sign in or create account using the form below! It's fast and easy!";
        actions = {
          switchFormText: "Create Account",
          submitText: "Sign In"
        };
        onSubmit = logInUser;
      } else {
        cardTitle = "Create Account";
        formDescription = "Sign in or create account using the form below! It's fast and easy!";
        actions = {
          switchFormText: "Sign In",
          submitText: "Create Account"
        };
        onSubmit = createUser;
      }
      renderAccount = <form onSubmit={handleSubmit((values => onSubmit(values)))}>
        <DialogContent>
          <DialogContentText>{formDescription}</DialogContentText>
          {
            !isSignInForm && <div className={classes.formControl}>
                <Field name="firstname" type="text" component={TextField} label="Firstname" fullWidth={true} margin="normal" className={classes.firstName}/>
                <Field name="lastname" type="text" component={TextField} label="Lastname" fullWidth={true} margin="normal" className={classes.lastName}/>
              </div>
          }
          <div>
            <Field name="email" type="email" component={TextField} label="Email" fullWidth={true} margin="normal"/>
          </div>
          <div>
            <Field name="password" type="password" component={TextField} label="Password" fullWidth={true} margin="normal"/>
          </div>
        </DialogContent>
        <DialogActions>
          <Button disabled={submitting} onClick={() => switchAccountForm()} color="default">
            {actions.switchFormText}
          </Button>
          <Button type="submit" raised={true} disabled={pristine || submitting} color="primary" autoFocus="autoFocus">
            {actions.submitText}
          </Button>
        </DialogActions>
      </form>
    }

    return (<Dialog open={accountFormDialogOpen} onClose={() => this.props.toggleAccountForm(false)}>
      <DialogTitle>{cardTitle}</DialogTitle>
      {renderAccount}
    </Dialog>);
  }
}

function mapStateToProps(state) {
  return {accountFormDialogOpen: state.ui.accountFormDialogOpen, isSignInForm: state.ui.isSignInForm}
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    toggleAccountForm: toggleAccountForm,
    switchAccountForm: switchAccountForm,
    createUser: createUser,
    logInUser: logInUser,
    changePassword: changePassword,
    logoutUser: logoutUser,
    changeApiKey: changeApiKey
  }, dispatch)
}

AccountForm = reduxForm({
  form: 'Account', // a unique identifier for this form
})(AccountForm);

export default compose(withTracker((props) => {
  const currentUser = Meteor.user();
  const userId = Meteor.userId();

  return {currentUser,
  isUserResearcher: Roles.userIsInRole(userId, 'researcher'),
  isUserAdmin: Roles.userIsInRole(userId, 'admin'),
  isUserSup: Roles.userIsInRole(userId,'superuser')
  };
}), withMobileDialog(), withStyles(styles), connect(mapStateToProps, mapDispatchToProps,),)(AccountForm);

