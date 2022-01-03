/**
 * Parses customParams String into a Javascript Object
 *
 * @param {String} customParams
 * @returns {Object} customParams Object
 */
export function parseCustomParams(customParams) {
  let result = {};
  customParams.split(",").forEach(function(part) {
    const item = part.split("=");
    const key = item[0].replace(/^\s+|\s+$/g, ''); // remove leading and tailing white spaces
    result[key] = decodeURIComponent(item[1]).replace(/^\s+|\s+$/g, ''); // remove leading and tailing white spaces
  });
  return result;
}

export function buildParams(params, paramsMapping) {
  // -- Include custom params
  let customParams = params["customParams"]
    ? parseCustomParams(params["customParams"])
    : {};
  params = Object.assign(params, customParams); // merge searchParams with customParams

  // rebuild search params using valid parameter names (from twitter API)
  const mappedParams = {};
  Object.keys(params).map(function(key) {
    // Check if param is relevant for search api and that its value is not null
    if (typeof paramsMapping[key] !== 'undefined' && params[key] !== null) {
      mappedParams[paramsMapping[key]] = params[key];
    }
  });
  return mappedParams;
}

/**
 * Generates object of edges and nodes by scraping tweets retrieved from Twitter search API
 *
 * @param responseList
 * @param data
 * @returns {{graphData: {edges: Array, nodes: Array}, tweets: Array, graphMetadata: {numberOfTweets: number, numberOfNodes: number, numberOfEdges: number}}}
 */
export function generateGraphData(responseList, data = null) {
  let nodes = [];
  let edges = [];
  let tweets = []; // store tweets separately so that there are no duplicates
  let nodeId = 0;
  let edgeId = 0;
  let numberOfTweets = 0;
  let numberOfNodes = 0;
  let numberOfEdges = 0;
  // initialize data to override graphData
  if (data) {
    nodes = data.graphData.nodes;
    edges = data.graphData.edges;
    tweets = data.tweets;
    numberOfTweets = data.graphMetadata.numberOfTweets;
    numberOfNodes = data.graphMetadata.numberOfNodes;
    numberOfEdges = data.graphMetadata.numberOfEdges;
    nodeId = numberOfNodes;
    edgeId = numberOfEdges;
  }
  let ts = [];
  responseList.forEach(function(response) {
    let statuses = response["statuses"];
    statuses.forEach(function(status) {
      numberOfTweets++; // increment number of tweets
      let hashtags = []
      status["entities"]["hashtags"].forEach(function(h) {
        hashtags.push(h.text)
      });

      const tweet = {
        id: status['id_str'],
        created_at: status['created_at'],
        text: status['text'],
        user: {
          name: status['user']['name'],
          screen_name: status['user']['screen_name'],
          verified: status['user']['verified'],
          profile_image_url_https: status['user']['profile_image_url_https']
        },
        retweet_count: status['retweet_count'],
        favorite_count: status['favorite_count'],
        lang: status['lang'],
        hashtags: hashtags
      };
      ts.push(tweet);

      let nodeIds = [];
      // Increment node weight if it already exists in nodes list or add it if not
      hashtags.forEach(function(hashtag) {
        let node = nodes.find((o, i) => {
          if (o.label.toLowerCase() === hashtag.toLowerCase()) { // check if same hashtag, case unsensitive
            nodes[i].size++;
            nodes[i].weight++;
            nodeIds.push(nodes[i]["id"]);
            return true;
          }
        });
        if (!node) { // New node!
          // increment nodeId and push it to the status nodeIds array
          nodeIds.push(++nodeId);
          numberOfNodes++; // increment number of nodes
          // push new node to the graphData
          nodes.push(Object({id: Number(nodeId), label: hashtag, size: 1, weight: 1}));
        }
      });
      if (nodeIds.length > 1) { // store tweet if at least 2 hashtags inside
        tweets.push(tweet);
      }
      // loop over added nodes of tweet to build edges
      while (nodeIds.length > 0) {
        let nodeIdsLen = nodeIds.length;
        for (let j = 1; j < nodeIdsLen; j++) {
          const source = nodeIds[0];
          const target = nodeIds[j];
          // check if edge exists already to increment weight and store tweet id
          let edge = edges.find((o, i) => {
            if ((o.source === source && o.target === target) || (o.source === target && o.target === source)) {
              let weight = ++edges[i].weight;
              edges[i].tweets.push(tweet.id);

              edges[i].size++;
              edges[i].weight++;
              edges[i].label = weight.toString();

              return true;
            }
          });
          // if edge doesn't exist
          if (!edge) { // new edge!
            ++edgeId;
            numberOfEdges++; // increment number of egdes
            edges.push(Object({
              id: Number(edgeId),
              tweets: [tweet.id],
              source: Number(source),
              target: Number(target),
              size: 1,
              weight: 1,
              label: "1"
            }));
          }
        }
        // remove first element
        nodeIds.shift()
      }
    });
  });

  nodes.sort((a, b) => {
    return b.weight - a.weight;
  })

  return {
    graphData: {
      edges: edges,
      nodes: nodes
    },
    tweets: tweets,
    graphMetadata: {
      numberOfTweets: numberOfTweets,
      numberOfNodes: numberOfNodes,
      numberOfEdges: numberOfEdges
    }
  }
}

/**
 * Validates imported data is what is expected
 * Returns false if not valid, true if it is.
 *
 * @param data
 * @returns {boolean}
 */
export function validateData(data) {
  // foreach element, check if it's the right type
  let elements = {
    graphLayout: 'string',
    minWeightFilter: 'number',
    graphData: 'object',
    tweets: 'object',
    graphMetadata: 'object',
    query: 'string',
    params: 'object',
    selected: 'object',
    highlighted: 'object',
    hidden: 'object',
    settings: 'object'
  };
  if (Object.keys(data).length === Object.keys(elements).length) { // same number of elements as file?
    for (let el in data) {
      if (el in elements) { // does element exist in defined element object?
        if (!(typeof data[el] === elements[el])) { // does element is of expected type?
          return false
        }
      } else {
        return false;
      }
    }
  } else {
    return false;
  }
  return true;
}

/**
 * Reads uploaded file as text
 *
 * @param inputFile
 * @returns {Promise<any>}
 */
export const readUploadedFileAsText = (inputFile) => {
  const temporaryFileReader = new FileReader();

  return new Promise((resolve, reject) => {
    temporaryFileReader.onerror = () => {
      temporaryFileReader.abort();
      reject(new DOMException("Problem parsing input file."));
    };

    temporaryFileReader.onload = () => {
      resolve(temporaryFileReader.result);
    };
    temporaryFileReader.readAsText(inputFile);
  });
};
