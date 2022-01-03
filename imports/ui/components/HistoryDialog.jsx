import React, {Component} from 'react';
import {bindActionCreators, compose} from 'redux';
import {withStyles} from 'material-ui/styles';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import classNames from "classnames";
import Dialog, {DialogContent, DialogContentText, DialogTitle, withMobileDialog} from 'material-ui/Dialog';
import {toggleHistoryDialog} from "../actions/UIActions";
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui-icons/Close';
import Slide from 'material-ui/transitions/Slide';
import {FormControlLabel} from 'material-ui/Form';
import HistoryTable from './HistoryTable';

const styles = theme => ({
  paper: {
    maxWidth: '100%'
  },
  dialogContent: {
    padding: 0
  },
  closeButton: {
    margin: theme.spacing.unit,
    position: 'absolute',
    top: 0,
    right: 0
  }
});

function Transition(props) {
  return <Slide direction="down" {...props}/>;
}

class HistoryDialog extends Component {

  render() {
    const {fullScreen, classes} = this.props;

    return (<Dialog fullScreen={fullScreen} transition={Transition} open={this.props.historyDialogOpen} onClose={() => this.props.toggleHistoryDialog(false)} classes={{
        paper: classes.paper
      }}>
      <DialogTitle>
        History data
      </DialogTitle>
      <IconButton onClick={() => this.props.toggleHistoryDialog(false)} className={classes.closeButton} aria-label="Close">
        <CloseIcon/>
      </IconButton>
      <DialogContent className={classes.dialogContent}>
        <HistoryTable/>
      </DialogContent>
    </Dialog>);
  }
}

HistoryDialog.propTypes = {
  fullScreen: PropTypes.bool.isRequired
};

function mapStateToProps(state) {
  return {historyDialogOpen: state.ui.historyDialogOpen}
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    toggleHistoryDialog: toggleHistoryDialog
  }, dispatch)
}

export default compose(withMobileDialog(), withStyles(styles), connect(mapStateToProps, mapDispatchToProps,),)(HistoryDialog);
