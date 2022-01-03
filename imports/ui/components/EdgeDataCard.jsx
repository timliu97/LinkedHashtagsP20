import React from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators, compose} from "redux";
import {connect} from "react-redux";
import {withStyles} from 'material-ui/styles';
import classNames from 'classnames';
import Card, {CardActions, CardContent, CardHeader} from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';
import VerifiedIcon from 'material-ui-icons/CheckCircle';
import IconButton from 'material-ui/IconButton';
import Button from 'material-ui/Button';
import FavoriteIcon from 'material-ui-icons/Favorite';
import RetweetIcon from 'material-ui-icons/Repeat';
import Typography from 'material-ui/Typography';
import Highlighter from 'react-highlight-words';
import moment from 'moment';
import {blueGrey} from 'material-ui/colors';
import CloseIcon from 'material-ui-icons/Close';
import {toggleEdgeDataCard} from "../actions/UIActions";

const styles = theme => ({
  card: {
    maxWidth: 400,
    width: 400,
    height: 'calc(100% - 163px)',
    position: 'absolute',
    overflowY: 'auto',
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    boxShadow: 'none',
    borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
    visibility: 'hidden',
    opacity: 0,
    transition: [
      theme.transitions.create('visibility', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen
      }),
      theme.transitions.create('opacity', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen
      })
    ]
  },
  show: {
    visibility: 'visible',
    opacity: 1
  },
  cardHeader: {
    position: 'fixed',
    width: 400,
    maxHeight: 85,
    boxSizing: 'border-box',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    zIndex: 9,
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
    borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
    marginTop: -85
  },
  tweet: {
    marginBottom: theme.spacing.unit
  },
  tweetHeader: {
    padding: theme.spacing.unit
  },
  tweetContent: {
    padding: theme.spacing.unit
  },
  avatar: {
    position: 'relative'
  },
  verified: {
    position: 'absolute',
    width: 15,
    bottom: -7,
    right: -4
  },
  screenName: {
    color: blueGrey[300],
    marginLeft: theme.spacing.unit
  },
  actionButton: {
    width: 'auto',
    fontSize: '1rem',
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  actionNumber: {
    marginLeft: theme.spacing.unit
  },
  highlight: {
    backgroundColor: 'rgba(255, 64, 129, 0.2)'
  }
});

class EdgeDataCard extends React.Component {
  render() {
    const {
      tweets,
      toggleEdgeDataCard,
      showEdgeDataCard,
      edgeData,
      hashtagList,
      classes
    } = this.props;

    // don't render if no edge has been selected
    let source = '';
    let sourceNoh = '';
    let target = '';
    let targetNoh = '';
    if (edgeData.tweets.length) {
      sourceNoh = hashtagList.find(x => x.id === edgeData.source).label;
      source = '#' + sourceNoh;
      targetNoh = hashtagList.find(x => x.id === edgeData.target).label;
      target = '#' + targetNoh;
    }
    _tweets = tweets;
    if (!_tweets) 
      _tweets = [];
    
    return (<Card className={classNames(classes.card, showEdgeDataCard && classes.show)}>
      <CardHeader title={source + ' — ' + target} subheader={'Number of tweets: ' + edgeData.weight} className={classes.cardHeader} action={<IconButton onClick = {
          () => toggleEdgeDataCard(false)
        } > <CloseIcon/>
      </IconButton>}/>
      <CardContent>
        {
          _tweets.map((tweet, i) => {
            // show tweet if in tweets
            if (edgeData.tweets.indexOf(tweet.id) > -1) {
              // show tweet if in tweets
              let created_at = moment(tweet.created_at, 'dd MMM DD HH:mm:ss ZZ YYYY').format('MMMM Do YYYY, HH:mm:ss');
              let dateRelative = moment(tweet.created_at, 'dd MMM DD HH:mm:ss ZZ YYYY').fromNow();
              return (<Card key={i} className={classes.tweet}>
                <CardHeader avatar={<div className = {
                    classes.avatar
                  } > <Avatar src={tweet.user.profile_image_url_https}/>
                    {
                    tweet.user.verified && <VerifiedIcon color="primary" className={classes.verified}/>
                  }
                  </div>
} title={<div > {
                    tweet.user.name
                  }
                  <span className={classes.screenName}>{'@' + tweet.user.screen_name}</span>
                </div>
} subheader={<span
                  title = {
                    created_at
                  } > {
                    dateRelative
                  }
                  </span>
} className={classes.tweetHeader}/>
                <CardContent className={classes.tweetContent}>
                  <Typography component="p">
                    <Highlighter highlightClassName={classes.highlight} searchWords={[source, target, sourceNoh, targetNoh]} autoEscape={true} textToHighlight={tweet.text}/>
                  </Typography>
                </CardContent>
                <CardActions>
                  <IconButton aria-label="Retweet Count" className={classes.actionButton}>
                    <RetweetIcon/>
                    <span className={classes.actionNumber}>
                      {tweet.retweet_count}
                    </span>
                  </IconButton>
                  <IconButton aria-label="Favorite Count" className={classes.actionButton}>
                    <FavoriteIcon/>
                    <span className={classes.actionNumber}>
                      {tweet.favorite_count}
                    </span>
                  </IconButton>
                  <a href={"https://twitter.com/statuses/" + tweet.id} target="_blank">
                    <Button>
                      View this tweet
                    </Button>
                  </a>
                </CardActions>
              </Card>);
            }
          })
        }
      </CardContent>
    </Card>);
  }
}

EdgeDataCard.propTypes = {
  classes: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {hashtagList: state.hashtagGraph.graphData.nodes, tweets: state.hashtagGraph.tweets, edgeData: state.ui.edgeData, showEdgeDataCard: state.ui.showEdgeDataCard}
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    toggleEdgeDataCard: toggleEdgeDataCard
  }, dispatch)
}

export default compose(withStyles(styles, {withTheme: true}), connect(mapStateToProps, mapDispatchToProps,),)(EdgeDataCard);
