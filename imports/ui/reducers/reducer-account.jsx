import {Meteor} from "meteor/meteor";
import {SubmissionError} from 'redux-form';
import {CHANGE_USER_PASSWORD, CREATE_USER, LOGIN_USER, LOGOUT_USER, CHANGE_API_KEY} from '../actions/_actionTypes';

export default function(state = {}, action) {
  switch (action.type) {
    case CHANGE_API_KEY:
      const _user = Meteor.user();
      let user_profile = _user.profile;
      let new_profile = Object.assign(user_profile, action.payload);
      Meteor.users.update({
        _id: _user._id
      }, {
        $set: {
          profile: new_profile
        }
      });
      break;
    case CREATE_USER:
      let user = {
        email: action.payload.email,
        password: action.payload.password,
        profile: {
          firstname: action.payload.firstname,
          lastname: action.payload.lastname
        }
      };
      Meteor.call('users.create', user, function(error) {
        if (!error) {
          Meteor.loginWithPassword(user.email, user.password);
          state = {
            ...state,
            open: false
          };
        } else {
          console.log('postForm: Error: ', error);
          throw new SubmissionError({username: 'User does not exist', _error: error});
        }
      });
      break;
    case LOGIN_USER:
      Meteor.loginWithPassword(action.payload.email, action.payload.password, (error) => {
        if (!error) {
          // NOT WORKING: close modal after login
          state = {
            ...state,
            open: false
          };
        } else {
          throw new SubmissionError({message: 'Incorrect email or password!', _error: 'Login failed!'});
        }
      });
      break;
    case CHANGE_USER_PASSWORD:
      Accounts.changePassword(action.payload.oldPassword, action.payload.newPassword, function(error) {
        if (!error) {
          // delete content of textfield
          // show success
        } else {
          //show error
        }
      });
      break;
    case LOGOUT_USER:
      Meteor.logout();
      break;
  }
  return state;
}
