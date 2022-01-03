import React, {Component} from 'react';
import {bindActionCreators, compose} from 'redux';
import {withStyles} from 'material-ui/styles';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import classNames from "classnames";
import Dialog, {DialogContent, DialogContentText, DialogTitle, withMobileDialog} from 'material-ui/Dialog';
import {toggleStreamDialog, toggleStreaming} from "../actions/UIActions";
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui-icons/Close';
import Slide from 'material-ui/transitions/Slide';
import {FormControlLabel} from 'material-ui/Form';
import Switch from 'material-ui/Switch';
import StreamTable from './JobsTable';

const styles = theme => ({
  paper: {
    maxWidth: '100%'
  },
  dialogContent: {
    padding: 0
  },
  aboutText: {
    fontSize: '0.9rem',
    padding: theme.spacing.unit * 2,
    paddingBottom: 0,
    textAlign: 'center'
  },
  closeButton: {
    margin: theme.spacing.unit,
    position: 'absolute',
    top: 0,
    right: 0
  },
  streamLabel: {
    fontSize: '1.3125rem',
    transition: theme.transitions.create('color', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  streamActiveLabel: {
    color: '#fff'
  },
  streamActiveHeader: {
    background: 'linear-gradient(45deg, #9295FC 30%, #E5A4F8 90%)'
  }
});

function Transition(props) {
  return <Slide direction="down" {...props}/>;
}

class StreamDialog extends Component {

  render() {
    const {toggleStreaming, streamingOn, fullScreen, classes} = this.props;

    return (<Dialog fullScreen={fullScreen} transition={Transition} open={this.props.streamDialogOpen} onClose={() => this.props.toggleStreamDialog(false)} classes={{
        paper: classes.paper
      }}>
      <DialogTitle className={classNames(streamingOn && classes.streamActiveHeader)}>
        <FormControlLabel control={<Switch
          checked = {
            streamingOn
          }
          onChange = {
            () => toggleStreaming(!streamingOn)
          }
          />} label={"Stream Tweets"} classes={{
            label: classNames(classes.streamLabel, streamingOn && classes.streamActiveLabel)
          }}/>
      </DialogTitle>
      <IconButton onClick={() => this.props.toggleStreamDialog(false)} className={classes.closeButton} aria-label="Close">
        <CloseIcon/>
      </IconButton>
      <DialogContent className={classes.dialogContent}>
        <DialogContentText className={classes.aboutText}>
          Here you can check and manage your streaming jobs!
        </DialogContentText>
        <StreamTable/>
      </DialogContent>
    </Dialog>);
  }
}

StreamDialog.propTypes = {
  fullScreen: PropTypes.bool.isRequired
};

function mapStateToProps(state) {
  return {streamDialogOpen: state.ui.streamDialogOpen, streamingOn: state.ui.streamingOn}
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    toggleStreamDialog: toggleStreamDialog,
    toggleStreaming: toggleStreaming
  }, dispatch)
}

export default compose(withMobileDialog(), withStyles(styles), connect(mapStateToProps, mapDispatchToProps,),)(StreamDialog);
