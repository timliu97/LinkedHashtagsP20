import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {applyMiddleware, createStore} from 'redux';
import thunk from 'redux-thunk';

import appReducer from '../imports/ui/reducers/index';

import App from '../imports/ui/containers/App';

const store = createStore(appReducer, applyMiddleware(thunk));

store.subscribe(() => {
  console.log('Store changed', store.getState())
});

Meteor.startup(() => {
  ReactDOM.render(<Provider store={store}>
    <App/>
  </Provider>, document.getElementById('app'));
});
