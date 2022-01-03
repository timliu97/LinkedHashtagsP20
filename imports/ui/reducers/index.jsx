import {combineReducers} from 'redux';
import UIReducer from './reducer-ui';
import AccountReducer from './reducer-account';
import HashtagGraphReducer from './reducer-hashtag-graph';
import JobReducer from './reducer-job';
import UserReducer from './reducer-user';
import {reducer as formReducer} from 'redux-form';

const appReducer = combineReducers({
  ui: UIReducer,
  account: AccountReducer,
  hashtagGraph: HashtagGraphReducer,
  job: JobReducer,
  users: UserReducer,
  form: formReducer
});

export default appReducer;
