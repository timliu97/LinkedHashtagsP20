import React, {Component} from 'react';
import {bindActionCreators, compose} from 'redux';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import Card, {CardContent, CardHeader} from 'material-ui/Card';
import classNames from "classnames";
import IconButton from 'material-ui/IconButton';
import Button from 'material-ui/Button';
import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField';
import {MenuItem, MenuList} from 'material-ui/Menu';
import {ListItemIcon, ListItemText} from 'material-ui/List';
import FileIcon from 'material-ui-icons/InsertDriveFile';
import Search from 'material-ui-icons/Search';
import FileSaver from 'file-saver';
import ExpansionPanel, {ExpansionPanelDetails, ExpansionPanelSummary, ExpansionPanelActions} from 'material-ui/ExpansionPanel';
import Typography from 'material-ui/Typography';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import {toggleHeatmap, changeHeatmapMode} from "../actions/UIActions";
import MapIcon from 'material-ui-icons/Map'
import Tooltip from 'material-ui/Tooltip';

const styles = theme => ({
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular
  },
  filtersInline: {
    paddingLeft: 0,
    listStyle: 'none',
    margin: 0
  },
  cardStyle: {
    marginRight: 30
  }
});

class AnalyticsPanel extends Component {
  _nodes = new Array();
  _nv = {};
  cc_all = new Array();

  getColor() {
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += (Math.random() * 16 | 0).toString(16);
    }
    return color;
  }

  findCC(graphData) {
    if (window._sigma) {
      this._nodes = new Array();
      this._nv = {};
      const graph = window._sigma.graph;
      let length = graphData.nodes.length;

      let length_n = 0;
      for (i = 0; i < length; i++) {
        let n_p = graph.nodes(i)
        if (!n_p.hidden) {
          this._nodes.push(n_p.id);
          this._nv[n_p.id] = false;
          ++length_n;
        }
      };
      let ii = 0;
      let count_cc = 0;
      if (this.cc_all.length != 0) 
        this.cc_all = new Array();
      for (ii = 0; ii < length_n; ii++) {
        if (!this._nv[this._nodes[ii]]) {
          let _color = this.getColor();
          let cc_one = this.dfs(graphData, this._nodes[ii], _color);
          this.cc_all.push({nodes: cc_one, color: _color, hidden: false});
          ++count_cc;
        }
      }
      window._sigma.refresh({skipIndexation: true});
      alert('Count: ' + count_cc);
    }
  }

  dfs(graphData, node_id, color) {
    const graph = window._sigma.graph;
    const edges = graphData.edges;
    const e_length = edges.length;
    let stack = new Array();
    let jj = 0;
    let nodes_back = new Array();

    graph.nodes(node_id).color = color;
    this._nv[node_id] = true;
    stack.push(node_id);
    let now_node = node_id;
    nodes_back.push(now_node);
    let is_over = true;
    while (stack.length != 0) {
      is_over = true;
      for (jj = 0; jj < e_length; jj++) {
        e = edges[jj];
        if (e.source == now_node) {
          if (this._nv[e.target] != undefined) {
            if (!this._nv[e.target]) {
              this._nv[e.target] = true;
              now_node = e.target;
              graph.nodes(now_node).color = color;
              nodes_back.push(now_node);
              stack.push(now_node);
              is_over = false;
              break;
            }
          }
        }

        if (e.target == now_node) {
          if (this._nv[e.source] != undefined) {
            if (!this._nv[e.source]) {
              this._nv[e.source] = true;
              now_node = e.source;
              graph.nodes(now_node).color = color;
              nodes_back.push(now_node);
              stack.push(now_node);
              is_over = false;
              break;
            }
          }
        }
      }

      if (is_over) {
        stack.pop();
        now_node = stack[stack.length - 1];
      }
    }
    return nodes_back;
  }

  filterCC(min_count) {
    const graph = window._sigma.graph;
    let length = this.cc_all.length;
    let k = 0,
      l = 0;
    for (k = 0; k < length; k++) {
      let cc_now = this.cc_all[k];
      let cc_now_nodes = cc_now.nodes;
      let ll = cc_now_nodes.length;
      if (ll < min_count) {
        cc_now.hidden = true;
        for (l = 0; l < ll; l++) {
          graph.nodes(cc_now_nodes[l]).hidden = true;
        }
      } else {
        if (cc_now.hidden) {
          cc_now.hidden = false;
          for (l = 0; l < ll; l++) {
            graph.nodes(cc_now_nodes[l]).hidden = false;
          }
        }
      }
    }
    window._sigma.refresh({skipIndexation: true});
  }

  exportToCSV() {
    const graph = window._sigma.graph;
    let length = this.cc_all.length;
    let csv_head = '';
    let csv_hashtag = new Array();
    let max_item = -1;
    let k = 0,
      l = 0;
    for (k = 0; k < length; k++) {
      let cc_now = this.cc_all[k];
      if (!cc_now.hidden) {
        csv_head += 'CC' + k + ',';
        let cc_now_nodes = cc_now.nodes;
        let ll = cc_now_nodes.length;
        let hashtag_cc = new Array();
        for (l = 0; l < ll; l++) {
          hashtag_cc.push(graph.nodes(cc_now_nodes[l]).label);
        }
        if (hashtag_cc.length > max_item) {
          max_item = hashtag_cc.length;
        }
        csv_hashtag.push({list: hashtag_cc, count: hashtag_cc.length});
      }
    }
    csv_head += '\n';

    let csv_file = csv_head;
    let length_r = csv_hashtag.length;
    for (k = 0; k < max_item; k++) {
      for (l = 0; l < length_r; l++) {
        if (csv_hashtag[l].count > k) {
          csv_file += csv_hashtag[l].list[k] + ',';
        } else {
          csv_file += ',';
        }
      }
      csv_file += '\n';
    }
    let blob = new Blob([csv_file], {type: "text/csv;charset=utf-8"});
    FileSaver.saveAs(blob, 'CC_CSV.csv');
  }

  render() {
    const {
      query,
      isToggleAnalyticsPanel,
      graphData,
      hiddenHashtags,
      istoggleHeatmap,
      classes
    } = this.props;
    return (<ExpansionPanel className={classes.filtersInline} hidden={!isToggleAnalyticsPanel}>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <Typography className={classes.heading}>Analytics Panel</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <Card className={classes.cardStyle}>
          <Button onClick={() => this.findCC(graphData)}>
            <Search/>
            Find Connected Components
          </Button>
          <Divider/>
          <CardContent>
            <TextField id="nodes_min_display" label="Minimum node count" defaultValue={'1'} onChange={(event) => {
                (event.target.value < 0)
                  ? event.target.value = 0
                  : this.filterCC(event.target.value)
              }} type="number" margin="normal"
              //className={classes.menuItem}

            />
            <MenuItem onClick={() => this.exportToCSV()}>
              <ListItemIcon>
                <FileIcon/>
              </ListItemIcon>
              <ListItemText primary="Download CSV File"/>
            </MenuItem>
          </CardContent>
        </Card>

        <Card className={classes.cardStyle}>
          <Button onClick={() => this.props.toggleHeatmap(!istoggleHeatmap)}>
            <MapIcon/>
            Toggle Map
          </Button>
          <Divider/>
          <CardContent>
            <MenuItem onClick={() => this.props.changeHeatmapMode(0)}>
              <ListItemText primary="Heatmap mode"/>
            </MenuItem>
            <MenuItem onClick={() => this.props.changeHeatmapMode(1)}>
              <ListItemText primary="Marker mode"/>
            </MenuItem>
          </CardContent>
        </Card>
      </ExpansionPanelDetails>
    </ExpansionPanel>);
  }
}

function mapStateToProps(state) {
  return {query: state.hashtagGraph.query, graphData: state.hashtagGraph.graphData, hiddenHashtags: state.hashtagGraph.hidden, isToggleAnalyticsPanel: state.ui.isToggleAnalyticsPanel, istoggleHeatmap: state.ui.istoggleHeatmap}
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    toggleHeatmap: toggleHeatmap,
    changeHeatmapMode: changeHeatmapMode
  }, dispatch)
}

export default compose(withStyles(styles, {withTheme: true}), connect(mapStateToProps, mapDispatchToProps,),)(AnalyticsPanel);
