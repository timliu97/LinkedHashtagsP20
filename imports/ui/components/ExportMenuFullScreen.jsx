import React, {Component} from 'react';
import {bindActionCreators, compose} from 'redux';
import {connect} from 'react-redux';
import {withStyles} from "material-ui/styles";
import {MenuItem, MenuList} from 'material-ui/Menu';
import {toggleExportDialog} from "../actions/UIActions";
import {ListItemIcon, ListItemText} from 'material-ui/List';
import ImageIcon from 'material-ui-icons/Photo';
import FileIcon from 'material-ui-icons/InsertDriveFile';
import FileSaver from 'file-saver';
import moment from 'moment';
var get_gexf = require("../../lib/export_GEXF.js");

const styles = theme => ({
  iconUp: {
    flexGrow: 1,
    marginBottom: theme.spacing.unit
  },
  btnText: {
    flexGrow: 1
  }
});

class ExportMenuFullScreen extends Component {
  _downloadFullTweets = async (isJob, id, filename) => {
    const method = isJob
      ? 'graphs.getFullTweets'
      : 'tweets.getFullTweets';
    const unique_id = await Meteor.callPromise(method, id);

    fileName = this._generateFileName(filename, 'tar');
    const zippedData = await fetch('/download_fulltweets/' + unique_id + '.tar');
    const downloadData = await zippedData.blob();
    FileSaver.saveAs(downloadData, fileName);
  };

  _downloadHashtagGraph = (hashtagGraph) => {
    // Possible improvement: compress json file
    const dataString = JSON.stringify(hashtagGraph),
      fileName = this._generateFileName(hashtagGraph.query, 'json');

    let blob = new Blob([dataString], {type: "text/plain;charset=utf-8"});
    FileSaver.saveAs(blob, fileName);
  };

  _downloadImage = (query) => {
    // retrieve sigma-scene canvas
    const canvas = document.getElementsByClassName('sigma-scene')[0],
      imgName = this._generateFileName(query, 'png');

    canvas.toBlob(function(blob) {
      FileSaver.saveAs(blob, imgName);
    });
  };

  _downloadGexf = (hashtagGraph) => {
    get_gexf.get_gexf({
      download: true,
      filename: this._generateFileName(hashtagGraph.query, 'gexf'),
      description: hashtagGraph.query,
      edgeAttributes: 'tweets'
    }, hashtagGraph.graphData.nodes, hashtagGraph.graphData.edges);
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
    const {hashtagGraph, classes, isFullscreen, isJob, id} = this.props;

    return (<MenuList role="menu">
      <MenuItem onClick={() => this._downloadFullTweets(isJob, id, hashtagGraph.query)}>
        <ListItemIcon>
          <FileIcon/>
        </ListItemIcon>
        <ListItemText primary="Full Tweets"/>
      </MenuItem>
      <MenuItem onClick={() => this._downloadImage(hashtagGraph.query)}>
        <ListItemIcon>
          <ImageIcon/>
        </ListItemIcon>
        <ListItemText primary="Image"/>
      </MenuItem>
      <MenuItem onClick={() => this._downloadHashtagGraph(hashtagGraph)}>
        <ListItemIcon>
          <FileIcon/>
        </ListItemIcon>
        <ListItemText primary="Json File"/>
      </MenuItem>
      <MenuItem onClick={() => this._downloadGexf(hashtagGraph)}>
        <ListItemIcon>
          <FileIcon/>
        </ListItemIcon>
        <ListItemText primary="GEXF File"/>
      </MenuItem>
    </MenuList>);
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
    toggleExportDialog: toggleExportDialog
  }, dispatch)
}

export default compose(withStyles(styles, {withTheme: true}), connect(mapStateToProps, mapDispatchToProps,),)(ExportMenuFullScreen);
