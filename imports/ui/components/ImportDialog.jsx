import React, {Component} from 'react';
import Button from 'material-ui/Button';
import {bindActionCreators, compose} from 'redux';
import {connect} from 'react-redux';
import classNames from 'classnames';
import {withStyles} from 'material-ui/styles';
import Dialog, {DialogActions, DialogContent, DialogContentText, DialogTitle, withMobileDialog} from 'material-ui/Dialog';
import {chooseFile, toggleImportDialog} from "../actions/UIActions";
import {uploadFile, upload, resetHashtagGraph} from "../actions/HashtagGraphActions";
import FileUploadIcon from 'material-ui-icons/FileUpload';
import CheckIcon from 'material-ui-icons/Check';
import {withTracker} from 'meteor/react-meteor-data';
import {Meteor} from 'meteor/meteor';
import {confinement} from '../../Demo/confinement.js';
import {the_voice} from '../../Demo/theVoice.js';
import {prayforkyoani} from '../../Demo/prayforkyoani.js';
import {demoData} from '../../Demo/DemoData.js';
import exemple from '../../Demo/confinement.json';

const styles = theme => ({
  buttonsContainer: {
    display: 'flex',
    marginTop: theme.spacing.unit * 2
  },
  button: {
    padding: '16px 30px'
  },
  buttonValid: {
    margin: theme.spacing.unit,
    background: 'linear-gradient(45deg, #9295FC 30%, #E5A4F8 90%)',
    borderRadius: 3,
    border: 0,
    color: 'white',
    boxShadow: '0 3px 5px 2px rgba(170, 105, 255, .30)',
    flexGrow: 1,
    flexDirection: 'column'
  },
  inputLabel: {
    margin: 'auto'
  },
  input: {
    display: 'none'
  },
  leftIcon: {
    marginRight: theme.spacing.unit
  },
  buttonLabel: {
    textTransform: 'initial'
  },
  fileName: {},
  fileSize: {
    marginLeft: theme.spacing.unit,
    fontSize: '0.7rem'
  }
});

class ImportDialog extends Component {

  formatBytes(bytes, decimals) {
    if (bytes === 0) 
      return '0 Bytes';
    let k = 1024,
      dm = decimals || 2,
      sizes = [
        'Bytes',
        'KB',
        'MB',
        'GB',
        'TB',
        'PB',
        'EB',
        'ZB',
        'YB'
      ],
      i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  render() {
    const {file, chooseFile, uploadFile, classes, isUserResearcher, isUserAdmin, upload, resetHashtagGraph} = this.props;
    const fileSubmitted = (file.size > 0);

    let uploadIcon = <FileUploadIcon className={classes.leftIcon}/>;
    if (fileSubmitted) {
      uploadIcon = <CheckIcon className={classes.leftIcon}/>;
    }

    return (<Dialog open={this.props.importDialogOpen} onClose={() => this.props.toggleImportDialog(false)}>
      <DialogTitle>Import Graph</DialogTitle>
      <DialogContent>
        <DialogContentText>
          You can visualize Hashtag Networks by importing data to the App. Only json files are accepted.
        </DialogContentText>
        <div className={classes.buttonsContainer}>
          <input accept=".json,application/json"
            //only accept json files
            className={classes.input} id="raised-button-file" multiple={true} type="file" onChange={(e) => chooseFile(e.target.files[0])}/>
          <label htmlFor="raised-button-file" className={classes.inputLabel}>
            <Button raised={true} component="span" className={classNames(classes.button, fileSubmitted && classes.buttonValid)}>
              {uploadIcon}
              <span className={classes.buttonLabel}>
                <span className={classes.fileName}>{file.name}</span>
                <span className={classes.fileSize}>{fileSubmitted && this.formatBytes(file.size)}
                </span>
              </span>
            </Button>
          </label>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => this.props.toggleImportDialog(false)} color="default">
          Cancel
        </Button>
        <Button onClick={() => upload(file)} color="primary" raised={true}>
           Import
        </Button>
      </DialogActions>
    </Dialog>);
  }
}

function mapStateToProps(state) {
  return {importDialogOpen: state.ui.importDialogOpen, file: state.ui.file}
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    toggleImportDialog: toggleImportDialog,
    chooseFile: chooseFile,
    uploadFile: uploadFile,
    upload: upload,
    resetHashtagGraph: resetHashtagGraph
  }, dispatch)
}

export default compose(withTracker(() => {
  const userId = Meteor.userId();
  return {
    currentUser: userId,
    isUserResearcher: Roles.userIsInRole(userId, 'researcher'),
    isUserAdmin: Roles.userIsInRole(userId, 'admin')
  }
}),withStyles(styles), withMobileDialog(), connect(mapStateToProps, mapDispatchToProps,),)(ImportDialog);
