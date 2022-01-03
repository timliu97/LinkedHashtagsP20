import React from 'react';
import 'react-sigma/sigma/sigma.plugins.dragNodes';

/**

 DragNodes component, interface for dragNodes sigma plugin.
 It supposes that sigma graph is already in place, therefore component should not be
 mounted until graph is available. It can be used within Sigma component if graph is
 preloaded, or within loader component, like NeoCypher.

 Allows to dragNodes around graph.

 @param {number} initialSize  start size for every node, will be multiplied by Math.sqrt(node.degree)

 **/

class DragNodes extends React.Component {

  constructor(props) {
    super(props);

    this.render = () => null;

    sigma.plugins.dragNodes(this.props.sigma, this.props.sigma.renderers[0]);
  }

}

DragNodes.propTypes = {
  sigma: typeof sigma === 'function'
    ? require('prop-types').instanceOf(sigma)
    : require('prop-types').any
};
export default DragNodes;
