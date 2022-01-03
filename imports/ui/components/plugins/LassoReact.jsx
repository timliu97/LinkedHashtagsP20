import React from 'react';
import {bindActionCreators, compose} from 'redux';
import {connect} from 'react-redux';
import './lasso.js';

class LassoReact extends React.Component {

  constructor(props) {
    super(props);
    this.render = () => null;
    const {creatLasso, edgeDict} = this.props;
    this.lasso = new sigma.plugins.lasso(this.props.sigma, this.props.sigma.renderers[0]);
    let this2 = this;
    this.dict = {};
    this.beginEdgeID = 0;
    this.updateEdgesDict();

    this.lasso.bind('selectedNodes', function(event) {
      let nodes = event.data;
      const nodesLen = nodes.length;
      console.log(nodes);

      let a = 'You have selected ' + nodesLen + ' nodes: ';
      let i = 0;
      for (i = 0; i < nodesLen; i++) {
        a += nodes[i].label + ', ';
      }

      a += '\n';

      let j = 0;
      let isC = true;
      for (i = 0; i < nodesLen; i++) {
        for (j = i + 1; j < nodesLen; j++) {
          if (!(this2.dict[nodes[i].id + "_" + nodes[j].id] || this2.dict[nodes[j].id + "_" + nodes[i].id])) {
            isC = false;
          }
        }
      }
      a += 'Is complete: ' + isC;
      alert(a);

      setTimeout(function() {
        this2.lasso.deactivate();
      }, 0);
    });

    this.props.sigma.bind('rightClickStage', function(e) {
      this2.lasso.activate(e);
    });
  }

  componentWillUnmount() {
    this.props.sigma.unbind('rightClickStage');
    this.lasso.unbind('selectedNodes');
    delete this.dict;
  }

  componentDidUpdate() {
    this.updateEdgesDict();
  }

  updateEdgesDict() {
    const e = this.props.edges;
    const eLen = e.length;
    let k = 0;
    for (k = this.beginEdgeID; k < eLen; k++) {
      this.dict[e[k].source + "_" + e[k].target] = true;
    }
    this.beginEdgeID = eLen;
  }
}

LassoReact.propTypes = {
  sigma: typeof sigma === 'function'
    ? require('prop-types').instanceOf(sigma)
    : require('prop-types').any
};

function mapStateToProps(state) {
  return {edges: state.hashtagGraph.graphData.edges}
};

export default compose(connect(mapStateToProps,),)(LassoReact);
