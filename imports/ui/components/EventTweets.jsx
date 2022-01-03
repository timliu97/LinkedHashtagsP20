import React from 'react';
import ReactDOM from "react-dom";
import PropTypes from 'prop-types';
import {bindActionCreators, compose} from "redux";
import {connect} from "react-redux";
import {withStyles} from 'material-ui/styles';
import {withTracker} from 'meteor/react-meteor-data';
import classNames from 'classnames';
import Card, {CardActions, CardContent, CardHeader} from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';
import VerifiedIcon from 'material-ui-icons/CheckCircle';
import IconButton from 'material-ui/IconButton';
import Checkbox from 'material-ui/Checkbox';
import FormControlLabel from 'material-ui/Form/FormControlLabel';
import Button from 'material-ui/Button';
import FavoriteIcon from 'material-ui-icons/Favorite';
import RetweetIcon from 'material-ui-icons/Repeat';
import ArrowDownward from 'material-ui-icons/ArrowDownward';
import Typography from 'material-ui/Typography';
import Highlighter from 'react-highlight-words';
import moment from 'moment';
import {blueGrey} from 'material-ui/colors';
import CloseIcon from 'material-ui-icons/Close';
import {Events} from "../../api/graphs";
import {checkTweet} from '../actions/UIActions';
import Event from 'material-ui-icons/Event';

const styles = theme => ({
  card: {
    maxWidth: 303,
    width: 300,
    height: 'calc(100% - 163px)',
    position: 'absolute',
    overflowY: 'auto',
    bottom: 0,
    left: 0,
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
    width: 300,
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

class EventTweets extends React.Component {
  constructor(props) {
    super(props);
    this.tweetCache = {};
    this.state = {
      items: null,
      isUpdate: true
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.isUpdate;
  }

  async componentWillReceiveProps(nextProps) {
    const {
      openedEventCards,
      tweetCheckedCount,
      tdiv_id,
      tids,
      tweetChecked,
      viewCheckedTweet
    } = nextProps;
    if (this.props.openedEventCards[tdiv_id] == openedEventCards[tdiv_id] && this.props.tweetCheckedCount[tdiv_id] == tweetCheckedCount[tdiv_id] && this.props.tids === tids && this.props.viewCheckedTweet == viewCheckedTweet) {
      this.setState({isUpdate: false});
      return false;
    } else {
      this.setState({isUpdate: true});
    }

    if (openedEventCards[tdiv_id]) {
      let tcCount = tweetCheckedCount[tdiv_id];
      let toload = tcCount
        ? 10 + tcCount
        : 10;
      let load_tids = tids;
      let tweetToGet = [];

      if (viewCheckedTweet) {
        toload = tcCount;
        load_tids = tweetChecked[tdiv_id]
          ? Object.keys(tweetChecked[tdiv_id])
          : [];
      } else {
        const tids_len = load_tids.length;
        if (tids_len < toload) 
          toload = tids_len;
        }
      
      let i = 0;
      for (i = 0; i < toload; i++) {
        if (!this.tweetCache[load_tids[i]]) {
          tweetToGet.push(load_tids[i]);
        }
      }

      let st = tdiv_id.split('_');
      source = st[1];
      target = st[2];

      let tcache = this.tweetCache;
      let classes = this.props.classes;
      let cchecked = tweetChecked[tdiv_id]
        ? tweetChecked[tdiv_id]
        : {};
      let tget = await Meteor.callPromise('graphs.gettweets', tweetToGet);
      const tget_len = tget.length;
      for (i = 0; i < tget_len; i++) {
        tcache[tget[i].id] = tget[i];
      }

      let items = [];
      for (i = 0; i < toload; i++) {
        const tweet = tcache[load_tids[i]];
        const _tid = tcache[load_tids[i]].id;
        let created_at = moment(tweet.created_at, 'dd MMM DD HH:mm:ss ZZ YYYY').format('MMMM Do YYYY, HH:mm:ss');
        let dateRelative = moment(tweet.created_at, 'dd MMM DD HH:mm:ss ZZ YYYY').fromNow();
        (viewCheckedTweet || !cchecked[_tid])
          ? items.push(<Card key={_tid} className={classes.tweet}>
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
                <Highlighter highlightClassName={classes.highlight} searchWords={[source, target]} autoEscape={true} textToHighlight={tweet.text}/>
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
              <a href={"https://twitter.com/statuses/" + _tid} target="_blank">
                <Button>
                  View this tweet
                </Button>
              </a>
              <FormControlLabel control={<Checkbox
                key = {
                  'ck' + _tid
                }
                checked = {
                  viewCheckedTweet
                }
                disable = {
                  viewCheckedTweet.toString()
                }
                onChange = {
                  (e, x) => {
                    !viewCheckedTweet
                      ? this.props.checkTweet(this.props.id, tdiv_id, _tid)
                      : null
                  }
                }
                color = "primary"
                />} label="Check"/>
            </CardActions>
          </Card>)
          : null;
      }
      this.setState({items: items});
    } else {
      return this.setState({items: null});;
    }
  }
  render() {
    const items = this.state.items;
    return (
      items
      ? <div>{items}</div>
      : null);
  }
}

EventTweets.propTypes = {
  classes: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {openedEventCards: state.ui.openedEventCards, tweetCheckedCount: state.ui.tweetCheckedCount, tweetChecked: state.ui.tweetChecked, viewCheckedTweet: state.ui.viewCheckedTweet}
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    checkTweet: checkTweet
  }, dispatch)
}

export default compose(withStyles(styles, {withTheme: true}), connect(mapStateToProps, mapDispatchToProps),)(EventTweets);
