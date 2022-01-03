import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import {grey} from 'material-ui/colors';
import SearchParamsForm from './SearchParamsForm';
import SearchParamsList from './SearchParamsList';
import StreamParamsForm from './StreamParamsForm';
import StreamParamsList from './StreamParamsList';
import IconButton from 'material-ui/IconButton';
import OpenIcon from 'material-ui-icons/FilterList';
import CloseIcon from 'material-ui-icons/Close';
import {bindActionCreators, compose} from "redux";
import {connect} from "react-redux";
import {toggleParamsForm} from "../actions/UIActions";
import classNames from "classnames";
import {getFormValues} from 'redux-form';
import Tooltip from 'material-ui/Tooltip';
import {withTracker} from 'meteor/react-meteor-data'
import {Meteor} from 'meteor/meteor'

const styles = theme => ({
  root: {
    position: 'relative',
    display: 'block',
    paddingRight: theme.spacing.unit * 2,
    paddingLeft: theme.spacing.unit * 2,
    padding: theme.spacing.unit,
    width: '100%',
    minHeight: 64,
    maxHeight: 64,
    overflow: 'hidden',
    zIndex: 9,
    backgroundColor: grey['200'],
    boxSizing: 'border-box',
    transition: theme.transitions.create('min-height', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen * 2
    }),
    borderBottom: '1px solid #dddddd'
  },
  formOpen: {
    minHeight: 400,
    overflow: 'auto'
  },
  paramsList: {
    display: 'flex',
    alignItems: 'center',
    width: '100%'
  },
  button: {
    marginLeft: 'auto'
  }
});

class ParamsInfo extends Component {

  isEmptyObject(o) {
    if (typeof o !== 'undefined') {
      return Object.keys(o).every(function(x) {
        return o[x] === '' || o[x] === null; // or just "return o[x];" for falsy values
      });
    }
    return true;
  }
    popout(){
    window._sigma.refresh({skipIndexation: true});
      alert('Vous devez activer votre compte afin de accéder à cette fonctionnalité');
    }
  render() {
    const {
      streamingOn,
      searchParamsValues,
      streamParamsValues,
      toggleSearchParamsForm,
      paramsFormOpen,
      classes,
      isUserResearcher,
      isUserAdmin,
      isUserGuest,
      isUserSup
    } = this.props;

    let paramsLabel,
      paramsForm,
      paramsList;
    if (streamingOn) {
      paramsLabel = 'Stream Params';
      paramsForm = <StreamParamsForm/>;
      paramsList = <StreamParamsList/>;
      if (this.isEmptyObject(streamParamsValues)) {
        paramsLabel = <i>You haven't set any params, open the form on the right to tweak your search!</i>;
      }
    } else {
      paramsLabel = 'Search Params';
      paramsForm = <SearchParamsForm/>;
      paramsList = <SearchParamsList/>;
      if (this.isEmptyObject(searchParamsValues)) {
        paramsLabel = <i>You haven't set any params, open the form on the right to tweak your search!</i>;
      }
    }

    let paramsBtn = <OpenIcon/>;
    if (paramsFormOpen) {
      paramsBtn = <CloseIcon/>
    }

    return (<Toolbar className={classNames(classes.root, paramsFormOpen && classes.formOpen)}>
      <div className={classes.paramsList}>
        <Typography type="subheading" color="inherit">
          {paramsLabel}
        </Typography>
        {paramsList}
        <Tooltip className={classes.button} placement="left" title={paramsFormOpen
            ? 'Close Params Form'
            : 'Open Params Form'}>{
            isUserAdmin || isUserSup || isUserResearcher
            ? <IconButton color="default" component="span" onClick={() => toggleSearchParamsForm(!paramsFormOpen)}>
                {paramsBtn}
                </IconButton>
            : <IconButton color="default" component="span" onClick={() => this.popout()}>
             {paramsBtn}
             </IconButton>
             }
        </Tooltip>
      </div>
      {paramsForm}
    </Toolbar>);
  }
}

ParamsInfo.propTypes = {
  classes: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    paramsFormOpen: state.ui.paramsFormOpen, searchParamsValues: getFormValues('SearchParams')(state),
    streamParamsValues: getFormValues('StreamParams')(state),
    streamingOn: state.ui.streamingOn
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    toggleSearchParamsForm: toggleParamsForm
  }, dispatch)
}

export default compose(withTracker(() => {
  const userId = Meteor.userId();
  return {
    currentUser: userId,
    isUserResearcher: Roles.userIsInRole(userId, 'researcher'),
    isUserAdmin: Roles.userIsInRole(userId, 'admin'),
    isUserGuest: Roles.userIsInRole(userId, 'guest'),
    isUserSup: Roles.userIsInRole(userId,'superuser')
  }
}),withStyles(styles, {withTheme: true}), connect(mapStateToProps, mapDispatchToProps,),)(ParamsInfo);
