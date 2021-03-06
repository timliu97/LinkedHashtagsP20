/**
 * Sigma GEXF File Exporter
 * ================================
 *
 * The aim of this plugin is to enable users to retrieve a GEXF file of the
 * graph.
 *
 * Author: Sébastien Heymann <seb@linkurio.us> (Linkurious)
 * Thanks to Guillaume Plique (Yomguithereal)
 * Version: 0.0.1
 */

// Utilities
function download(fileEntry, extension, filename) {
  var blob = null,
    objectUrl = null,
    dataUrl = null;

  if (window.Blob) {
    // use Blob if available
    blob = new Blob([fileEntry], {type: 'text/xml'});
    objectUrl = window.URL.createObjectURL(blob);
  } else {
    // else use dataURI
    dataUrl = 'data:text/xml;charset=UTF-8,' + encodeURIComponent('<?xml version="1.0" encoding="UTF-8"?>') + encodeURIComponent(fileEntry);
  }

  if (navigator.msSaveBlob) { // IE11+ : (has Blob, but not a[download])
    navigator.msSaveBlob(blob, filename);
  } else if (navigator.msSaveOrOpenBlob) { // IE10+ : (has Blob, but not a[download])
    navigator.msSaveOrOpenBlob(blob, filename);
  } else {
    // A-download
    var anchor = document.createElement('a');
    anchor.setAttribute(
      'href', (window.Blob)
      ? objectUrl
      : dataUrl);
    anchor.setAttribute('download', filename || 'graph.' + extension);

    // Firefox requires the link to be added to the DOM before it can be clicked.
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }

  if (objectUrl) {
    setTimeout(function() { // Firefox needs a timeout
      window.URL.revokeObjectURL(objectUrl);
    }, 0);
  }
}

/**
 * Convert Javascript string in dot notation into an object reference.
 *
 * @param  {object} obj The object.
 * @param  {string} str The string to convert, e.g. 'a.b.etc'.
 * @return {?}          The object reference.
 */
function strToObjectRef(obj, str) {
  // http://stackoverflow.com/a/6393943
  if (!str || str === null) 
    return null;
  return str.split('.').reduce(function(obj, i) {
    return obj[i]
  }, obj);
}

/**
 * Transform a color encoded in hexadecimal (shorthand or full form) into an
 * RGB array.
 * See http://stackoverflow.com/a/5623838
 *
 * @param  {string} hex The color in hexadecimal.
 * @return {array}      The color in RGB.
 */
function hexToRgb(hex) {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function(m, r, g, b) {
    return r + r + g + g + b + b;
  });

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ]
    : null;
}

/**
 * Today formatted as YYYY-MM-DD.
 * See http://stackoverflow.com/a/1531093
 *
 * @return {string} The formatted date of the day.
 */
function getDate() {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1; //January is 0!
  var yyyy = today.getFullYear();

  if (dd < 10) {
    dd = '0' + dd;
  }
  if (mm < 10) {
    mm = '0' + mm;
  }
  return yyyy + '-' + mm + '-' + dd;
}

/**
 * Return true if the parameter is an integer.
 * See http://stackoverflow.com/a/3885817
 */
function isInteger(n) {
  return n === + n && n === (n | 0);
}

/**
 * Update the type of a variable according to a specified value.
 *
 * @param  {?}      x    A value of the variable.
 * @param  {string} type The variable type.
 * @return {string}      The updated variable type.
 */
function typeOf(x, type) {
  if (type === 'integer' && typeof x === 'number') {
    if (!isInteger(x)) {
      type = 'float';
    }
  } else if (typeof x !== 'number') {
    type = 'string';

    if (typeof x === 'boolean') {
      type = 'boolean';
    }
    // NOT available in Gephi yet:
    /*else if (Object.prototype.toString.call(x) === '[object Array]') {
      type = 'list-string';
    }*/
  }
  return type;
}

/**
 * Transform the graph memory structure into a GEXF representation (XML dialect).
 * See http://gexf.net/
 * The method builds a DOM tree before serializing it.
 *
 * @param  {object} params The options.
 * @return {string}        The GEXF string.
 */
exports.get_gexf = function(params, nodes, edges) {
  params = params || {};

  var doc = document.implementation.createDocument('', '', null),
    oSerializer = new XMLSerializer(),
    sXML = '',
    webgl = true,
    prefix;

  if (params.filterHidden) {
    var filterFunction = function(x) {
      return !x.hidden
    }
    nodes = nodes.filter(filterFunction)
    edges = edges.filter(filterFunction)
  }

  var o,
    attrs,
    nodeAttrIndex = {},
    nodeAttrCpt = 0,
    edgeAttrIndex = {},
    edgeAttrCpt = 0,
    attrDefElem,
    attrsElem,
    attrElem,
    nodeAttrsDefElem,
    edgeAttrsDefElem,
    colorElem,
    creatorElem,
    descriptionElem,
    edgesElem,
    edgeElem,
    graphElem,
    metaElem,
    nodesElem,
    nodeElem,
    rootElem,
    positionElem,
    sizeElem,
    textElem;

  rootElem = doc.createElement('gexf');
  rootElem.setAttribute('xmlns', 'http://www.gexf.net/1.2draft');
  rootElem.setAttribute('xmlns:viz', 'http://www.gexf.net/1.2draft/viz');
  rootElem.setAttribute('xmlns:xsi', 'http://www.w3.org/2001/XMLSchema-instance');
  rootElem.setAttribute('xsi:schemaLocation', 'http://www.gexf.net/1.2draft http://www.gexf.net/1.2draft/gexf.xsd');
  rootElem.setAttribute('version', '1.2');

  metaElem = doc.createElement('meta');
  metaElem.setAttribute('lastmodifieddate', getDate());

  if (params.creator) {
    creatorElem = doc.createElement('creator');
    textElem = doc.createTextNode('' + params.creator);
    creatorElem.appendChild(textElem);
    metaElem.appendChild(creatorElem);
  }

  if (params.description) {
    descriptionElem = doc.createElement('description');
    textElem = doc.createTextNode('' + params.description);
    descriptionElem.appendChild(textElem);
    metaElem.appendChild(descriptionElem);
  }

  graphElem = doc.createElement('graph');
  graphElem.setAttribute('mode', 'static');

  // NODES
  nodesElem = doc.createElement('nodes');
  max_size = -1;
  for (var i = 0; i < nodes.length; i++) {
    size = nodes[i].size;
    if (size > max_size) 
      max_size = size;
    }
  min_size = 6;

  for (var i = 0; i < nodes.length; i++) {
    o = nodes[i];
    nodeElem = doc.createElement('node');
    nodeElem.setAttribute('id', o.id);

    // NODE LABEL
    if (o.label) 
      nodeElem.setAttribute('label', o.label);
    
    // NODE ATTRIBUTES
    attrs = strToObjectRef(o, params.nodeAttributes);
    if (attrs) {
      attrsElem = doc.createElement('attvalues');

      Object.keys(attrs).forEach(function(k) {
        if (!(k in nodeAttrIndex)) {
          nodeAttrIndex[k] = {
            id: nodeAttrCpt,
            type: 'integer'
          };
          nodeAttrCpt++;
        }

        var v = attrs[k];
        nodeAttrIndex[k].type = typeOf(v, nodeAttrIndex[k].type);

        attrElem = doc.createElement('attvalue');
        attrElem.setAttribute('for', nodeAttrIndex[k].id);
        attrElem.setAttribute('value', v);
        attrsElem.appendChild(attrElem);
      });

      nodeElem.appendChild(attrsElem);
    }

    // NODE VIZ
    rgb = hexToRgb("#0033FF");
    if (rgb.length > 2) {
      colorElem = doc.createElement('viz:color');
      colorElem.setAttribute('r', rgb[0]);
      colorElem.setAttribute('g', rgb[1]);
      colorElem.setAttribute('b', rgb[2]);
      if (rgb.length > 3) {
        if (rgb.length === 5) 
          colorElem.setAttribute('a', rgb[3] + '.' + rgb[4]);
        else 
          colorElem.setAttribute('a', rgb[3]);
        }
      nodeElem.appendChild(colorElem);
    }

    if (o.size) {
      sizeElem = doc.createElement('viz:size');
      size = o.size / max_size * 25;
      if (size < min_size) 
        size = min_size;
      sizeElem.setAttribute('value', size);
      nodeElem.appendChild(sizeElem);
    }
    /*
      positionElem = doc.createElement('viz:position');
      positionElem.setAttribute('x', o[prefix + 'x']);
      positionElem.setAttribute('y', -parseInt(o[prefix + 'y'], 10));
      nodeElem.appendChild(positionElem);
      */

    nodesElem.appendChild(nodeElem);
  }

  // DEFINITION OF NODE ATTRIBUTES
  nodeAttrsDefElem = doc.createElement('attributes');
  nodeAttrsDefElem.setAttribute('class', 'node');
  Object.keys(nodeAttrIndex).forEach(function(k) {
    attrDefElem = doc.createElement('attribute');
    attrDefElem.setAttribute('id', nodeAttrIndex[k].id);
    attrDefElem.setAttribute('title', k);
    attrDefElem.setAttribute('type', nodeAttrIndex[k].type);
    nodeAttrsDefElem.appendChild(attrDefElem);
  });

  // EDGES
  edgesElem = doc.createElement('edges');
  for (var i = 0; i < edges.length; i++) {
    o = edges[i];
    edgeElem = doc.createElement('edge');
    edgeElem.setAttribute('id', o.id);
    edgeElem.setAttribute('source', o.source);
    edgeElem.setAttribute('target', o.target);
    edgeElem.setAttribute('type', 'undirected');
    if (o.size) {
      edgeElem.setAttribute('weight', o.size);
    }

    // EDGE LABEL
    if (o.label) 
      edgeElem.setAttribute('label', o.label);
    
    // EDGE ATTRIBUTES
    attrs = strToObjectRef(o, params.edgeAttributes);
    if (attrs) {
      attrsElem = doc.createElement('attvalues');

      Object.keys(attrs).forEach(function(k) {
        if (!(k in edgeAttrIndex)) {
          edgeAttrIndex[k] = {
            id: edgeAttrCpt,
            type: 'integer'
          };
          edgeAttrCpt++;
        }

        var v = attrs[k];
        edgeAttrIndex[k].type = typeOf(v, edgeAttrIndex[k].type);

        attrElem = doc.createElement('attvalue');
        attrElem.setAttribute('for', edgeAttrIndex[k].id);
        attrElem.setAttribute('value', v);
        attrsElem.appendChild(attrElem);
      });

      edgeElem.appendChild(attrsElem);
    }

    // EDGE VIZ
    var rgb = hexToRgb('#757575');
    if (rgb.length > 2 && rgb.length <= 5) { // ignore alpha in rgba
      colorElem = doc.createElement('viz:color');
      colorElem.setAttribute('r', rgb[0]);
      colorElem.setAttribute('g', rgb[1]);
      colorElem.setAttribute('b', rgb[2]);
      edgeElem.appendChild(colorElem);
    }

    edgesElem.appendChild(edgeElem);
  }

  // DEFINITION OF EDGE ATTRIBUTES
  edgeAttrsDefElem = doc.createElement('attributes');
  edgeAttrsDefElem.setAttribute('class', 'edge');
  Object.keys(edgeAttrIndex).forEach(function(k) {
    attrDefElem = doc.createElement('attribute');
    attrDefElem.setAttribute('id', edgeAttrIndex[k].id);
    attrDefElem.setAttribute('title', k);
    attrDefElem.setAttribute('type', edgeAttrIndex[k].type);
    edgeAttrsDefElem.appendChild(attrDefElem);
  });

  graphElem.appendChild(nodeAttrsDefElem);
  graphElem.appendChild(edgeAttrsDefElem);
  graphElem.appendChild(nodesElem);
  graphElem.appendChild(edgesElem);
  rootElem.appendChild(metaElem);
  rootElem.appendChild(graphElem);
  doc.appendChild(rootElem);

  sXML = oSerializer.serializeToString(doc);

  if (params.download) {

    download(sXML, 'gexf', params.filename);
  }

  // Cleaning
  if (attrDefElem) 
    attrDefElem.parentNode.removeChild(attrDefElem);
  if (attrsElem) 
    attrsElem.parentNode.removeChild(attrsElem);
  if (attrElem) 
    attrElem.parentNode.removeChild(attrElem);
  if (colorElem) 
    colorElem.parentNode.removeChild(colorElem);
  if (creatorElem) 
    creatorElem.parentNode.removeChild(creatorElem);
  if (descriptionElem) 
    descriptionElem.parentNode.removeChild(descriptionElem);
  if (textElem) 
    textElem.parentNode.removeChild(textElem);
  if (positionElem) 
    positionElem.parentNode.removeChild(positionElem);
  if (sizeElem) 
    sizeElem.parentNode.removeChild(sizeElem);
  if (nodeElem) 
    nodeElem.parentNode.removeChild(nodeElem);
  if (edgeElem) 
    edgeElem.parentNode.removeChild(edgeElem);
  if (nodeAttrsDefElem) 
    nodeAttrsDefElem.parentNode.removeChild(nodeAttrsDefElem);
  if (edgeAttrsDefElem) 
    edgeAttrsDefElem.parentNode.removeChild(edgeAttrsDefElem);
  if (nodesElem) 
    nodesElem.parentNode.removeChild(nodesElem);
  if (edgesElem) 
    edgesElem.parentNode.removeChild(edgesElem);
  if (graphElem) 
    graphElem.parentNode.removeChild(graphElem);
  if (metaElem) 
    metaElem.parentNode.removeChild(metaElem);
  if (rootElem) 
    rootElem.parentNode.removeChild(rootElem);
  doc = null;

  return sXML;
};
