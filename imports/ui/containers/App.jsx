import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {createMuiTheme, MuiThemeProvider, withStyles} from 'material-ui/styles';
import Reboot from 'material-ui/Reboot';

import Header from '../components/Header';
import Toolbar from '../components/Toolbar';
import Sidebar from '../components/Sidebar';
import Content from '../components/Content';
import ImportDialog from '../components/ImportDialog';
import ExportDialog from '../components/ExportDialog';
import AccountForm from '../components/AccountForm';
import InfoDialog from '../components/InfoDialog';
import Upgrade from '../components/Upgrade';
import UsersDialog from '../components/UsersDialog';

const theme = createMuiTheme();

const styles = theme => ({
  '@global': {
    html: {
      background: theme.palette.background.default,
      WebkitFontSmoothing: 'antialiased', // Antialiasing.
      MozOsxFontSmoothing: 'grayscale', // Antialiasing.
      height: '100%'
    },
    body: {
      height: '100%'
    }
  },
  root: {
    width: '100%',
    height: '100%',
    zIndex: 1,
    overflow: 'hidden'
  },
  appFrame: {
    position: 'relative',
    display: 'flex',
    width: '100%',
    height: '100%'
  }
});

class App extends Component {
  render() {
    const {classes} = this.props;

    return (<MuiThemeProvider theme={theme}>
      <Reboot/>
      <div className={classes.root}>
        <div className={classes.appFrame}>
          <Header/>
          <Toolbar/>
          <Sidebar/>
          <Content/>
          <ImportDialog/>
          <UsersDialog/>
          <ExportDialog/>
          <AccountForm/>
          <InfoDialog/>
          <Upgrade/>
        </div>
      </div>
    </MuiThemeProvider>)
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles, {name: 'AppFrame'})(App);
