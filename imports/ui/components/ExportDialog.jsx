import {Meteor} from 'meteor/meteor';
import React, {Component} from 'react';
import Button from 'material-ui/Button';
import {bindActionCreators, compose} from 'redux';
import {connect} from 'react-redux';
import {withStyles} from "material-ui/styles";
import Dialog, {DialogActions, DialogContent, DialogContentText, DialogTitle, withMobileDialog} from 'material-ui/Dialog';
import {toggleExportDialog, toggleSnackbar, updateSnackbar} from "../actions/UIActions";
import ImageIcon from 'material-ui-icons/Photo';
import FileIcon from 'material-ui-icons/InsertDriveFile';
import FileSaver from 'file-saver';
import moment from 'moment';
import {withTracker} from 'meteor/react-meteor-data'
var get_gexf = require("../../lib/export_GEXF.js");

const styles = theme => ({
  buttonsContainer: {
    display: 'flex',
    marginTop: theme.spacing.unit * 2
  },
  buttonGray:{
  margin: theme.spacing.unit,
    background: 'gray',
    borderRadius: 3,
    border: 0,
    width: '50%',
    color: 'white',
    padding: '16px 30px',
    boxShadow: '0 3px 5px 2px rgba(170, 105, 255, .30)',
    flexGrow: 1,
    flexDirection: 'column'
  },
  button: {
    margin: theme.spacing.unit,
    background: 'linear-gradient(45deg, #9295FC 30%, #E5A4F8 90%)',
    borderRadius: 3,
    border: 0,
    width: '50%',
    color: 'white',
    padding: '16px 30px',
    boxShadow: '0 3px 5px 2px rgba(170, 105, 255, .30)',
    flexGrow: 1,
    flexDirection: 'column'
  },
  label: {
    display: 'flex',
    flexDirection: 'column'
  },
  iconUp: {
    flexGrow: 1,
    marginBottom: theme.spacing.unit
  },
  btnText: {
    flexGrow: 1
  }
});

class ExportDialog extends Component {
  _downloadFullTweets = async (isJob, id, filename, isUserResearcher, isUserAdmin, isUserSup) => {
    const method = isJob
      ? 'graphs.getFullTweets'
      : 'tweets.getFullTweets';
    if(isUserAdmin==true){
      this.props.updateSnackbar({error: false, message: "Downloading, Please wait..."})
      this.props.toggleSnackbar(true)
      const unique_id = await Meteor.callPromise(method, id)
      fileName = this._generateFileName(filename, 'tar')
      const zippedData = await fetch('/download_fulltweets/' + unique_id + '.tar')
      const downloadData = await zippedData.blob()
      FileSaver.saveAs(downloadData, fileName)
      this.props.toggleSnackbar(false)
      }else{ window._sigma.refresh({skipIndexation: true})
        alert('Vous devez activer votre compte pour accéder à cette fonctionnalité');
}
  };

  _downloadHashtagGraph = (hashtagGraph, isUserResearcher, isUserAdmin, isUserSup) => {
    if(isUserAdmin==true){
    // Possible improvement: compress json file
    const dataString = JSON.stringify(hashtagGraph),
      fileName = this._generateFileName(hashtagGraph.query, 'json');

    let blob = new Blob([dataString], {type: "text/plain;charset=utf-8"});
    FileSaver.saveAs(blob, fileName);
    }else{window._sigma.refresh({skipIndexation: true})
        alert('Vous devez activer votre compte pour accéder à cette fonctionnalité');}
  };

  _downloadImage = (query) => {
    if(isUserSup==true || isUserAdmin==true || isUserResearcher==true){

    // retrieve sigma-scene canvas
    const canvas = document.getElementsByClassName('sigma-scene')[0],
      imgName = this._generateFileName(query, 'png');

    canvas.toBlob(function(blob) {
      FileSaver.saveAs(blob, imgName);
    });
    }else{window._sigma.refresh({skipIndexation: true})
        alert('Vous devez activer votre compte pour accéder à cette fonctionnalité');
    }
  };

  _downloadGexf = (hashtagGraph, isUserResearcher, isUserAdmin, isUserSup) => {
  if(isUserSup==true || isUserAdmin==true){
    get_gexf.get_gexf({
      download: true,
      filename: this._generateFileName(hashtagGraph.query, 'gexf'),
      description: hashtagGraph.query,
      edgeAttributes: 'tweets'
    }, hashtagGraph.graphData.nodes, hashtagGraph.graphData.edges);
    }else{window._sigma.refresh({skipIndexation: true})
        alert('Vous devez activer votre compte pour accéder à cette fonctionnalité');}
  }
  /**
     * Generate a filename using query and formatted date
     *
     * @param query
     * @param ext
     * @returns {string} FileName
     * @private
     */
  _generateFileName(query, ext) {
    if (!query) 
      query = "Sample";
    
    // HG (Hashtag Graph) prefix + date and time
    const prefix = 'HG_' + moment(Date.now()).format("YYYYMMDD-hhmmss"),
      // replace spaces and dash by dash, put name in lowercase and remove characters if length of string > 32
      name = (query.replace(/^\s|(\s-)/, '-').toLowerCase()).substr(0, 32);
    return prefix + '_' + name + '.' + ext;
  }

  render() {
    const {hashtagGraph, classes, isFullscreen, isJob, id, isUserResearcher, isUserAdmin, isUserSup} = this.props;

return (
      !isFullscreen
      ? <Dialog open={!!this.props.exportDialogOpen} onClose={() => this.props.toggleExportDialog(false)}>
        <DialogTitle>Export Graph</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Export your Hashtag Graph as an
            <strong>image (PNG)</strong>
            or
            <strong>data file (JSON)</strong>.
          </DialogContentText>
          <div className={classes.buttonsContainer}>{
          isUserAdmin
            ?<Button onClick={() => this._downloadFullTweets(isJob, id, hashtagGraph.query, isUserResearcher, isUserAdmin, isUserSup)} classes={{
                root: classes.button,
                label: classes.label
              }}>
              <FileIcon className={classes.iconUp}/>
              <span className={classes.btnText}>Full Tweets (Coming soon)</span>
            </Button>
            :<Button onClick={() => this._downloadFullTweets(isJob, id, hashtagGraph.query, isUserResearcher, isUserAdmin, isUserSup)} classes={{
                root: classes.buttonGray,
                label: classes.label
              }}>
              <FileIcon className={classes.iconUp}/>
              <span className={classes.btnText}>Full Tweets</span>
            </Button>
            }{
            isUserSup || isUserAdmin || isUserResearcher
            ?<Button onClick={() => this._downloadImage(hashtagGraph.query)} classes={{
                root: classes.button,
                label: classes.label
              }}>
              <ImageIcon className={classes.iconUp}/>
              <span className={classes.btnText}>Image</span>
            </Button>
            :<Button onClick={() => this._downloadImage(hashtagGraph.query)} classes={{
                root: classes.buttonGray,
                label: classes.label
              }}>
              <ImageIcon className={classes.iconUp}/>
              <span className={classes.btnText}>Image</span>
            </Button>}{
            isUserAdmin
            ?<Button onClick={() => this._downloadHashtagGraph(hashtagGraph, isUserResearcher, isUserAdmin, isUserSup)} classes={{
                root: classes.button,
                label: classes.label
              }}>
              <FileIcon className={classes.iconUp}/>
              <span className={classes.btnText}>Json File</span>
            </Button>
            :<Button onClick={() => this._downloadHashtagGraph(hashtagGraph, isUserResearcher, isUserAdmin, isUserSup)} classes={{
                root: classes.buttonGray,
                label: classes.label
              }}>
              <FileIcon className={classes.iconUp}/>
              <span className={classes.btnText}>Json File</span>
            </Button>
            }{
            isUserAdmin || isUserResearcher
            ?<Button onClick={() => this._downloadGexf(hashtagGraph, isUserResearcher, isUserAdmin, isUserSup)} classes={{
                root: classes.button,
                label: classes.label
              }}>
              <FileIcon className={classes.iconUp}/>
              <span className={classes.btnText}>GEXF File</span>
            </Button>
            :<Button onClick={() => this._downloadGexf(hashtagGraph, isUserResearcher, isUserAdmin, isUserSup)} classes={{
                root: classes.buttonGray,
                label: classes.label
              }}>
              <FileIcon className={classes.iconUp}/>
              <span className={classes.btnText}>GEXF File</span>
            </Button>
            }
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => this.props.toggleExportDialog(false)} color="default">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      : null);
  }
}

function mapStateToProps(state) {
  const currentJob = state.job.currentJob;
  return {
    exportDialogOpen: state.ui.exportDialogOpen,
    isFullscreen: state.ui.isFullscreen,
    isJob: currentJob
      ? true
      : false,
    id: currentJob
      ? state.job.streamJobId
      : state.hashtagGraph.historyId,
    hashtagGraph: {
      // 11 elements
      graphLayout: state.hashtagGraph.graphLayout,
      minWeightFilter: state.hashtagGraph.minWeightFilter,
      graphData: state.hashtagGraph.graphData,
      tweets: state.hashtagGraph.tweets,
      graphMetadata: state.hashtagGraph.graphMetadata,
      query: currentJob
        ? currentJob.data.track
        : state.hashtagGraph.query,
      params: currentJob
        ? currentJob.data
        : state.hashtagGraph.params,
      selected: state.hashtagGraph.selected,
      highlighted: state.hashtagGraph.highlighted,
      hidden: state.hashtagGraph.hidden,
      settings: state.hashtagGraph.settings
    }
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    toggleExportDialog: toggleExportDialog,
    updateSnackbar: updateSnackbar,
    toggleSnackbar: toggleSnackbar
  }, dispatch)
}

export default compose(withTracker(() => {
  const userId = Meteor.userId();
  return {
    currentUser: userId,
    isUserResearcher: Roles.userIsInRole(userId, 'researcher'),
    isUserAdmin: Roles.userIsInRole(userId, 'admin'),
    isUserSup: Roles.userIsInRole(userId,'superuser')
  }
}),withStyles(styles, {withTheme: true}), withMobileDialog(), connect(mapStateToProps, mapDispatchToProps,),)(ExportDialog);
