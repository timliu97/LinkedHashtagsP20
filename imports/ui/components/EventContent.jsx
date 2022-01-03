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
import {blueGrey} from 'material-ui/colors';
import CloseIcon from 'material-ui-icons/Close';
import {toggleEventDataCard} from "../actions/UIActions";
import {Events} from "../../api/graphs";
import Event from 'material-ui-icons/Event';
import SearchBar from 'material-ui-search-bar'
import ExpansionPanel, {ExpansionPanelDetails, ExpansionPanelSummary, ExpansionPanelActions} from 'material-ui/ExpansionPanel';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import EventTweets from './EventTweets'
import {changeTweetEventCard} from '../actions/UIActions';

const styles = theme => ({
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
    color: 'white'
  },
  heading_black: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
    color: 'black'
  },
  filtersInline: {
    paddingLeft: 0,
    listStyle: 'none',
    margin: 0,
    marginBottom: '12px'
  },
  sumLess: {
    backgroundColor: 'green'
  },
  sumMiddle: {
    backgroundColor: 'yellow'
  },
  sumHigh: {
    backgroundColor: 'red'
  },
  digit: {
    position: 'absolute',
    right: '12px',
    color: 'white'
  },
  digit_black: {
    position: 'absolute',
    right: '12px',
    color: 'black'
  },
  detail: {
    paddingLeft: "0px",
    paddingRight: "0px"
  }
});

class EventContent extends React.Component {

  render() {
    const {
      events,
      tweetCheckedCount,
      changeTweetEventCard,
      level1Count,
      level2Count,
      classes
    } = this.props;
    if (!events) 
      return null;
    return (<div>
      {
        events.map((event, i) => {
          let tc = classes.sumLess;
          let tids = event.tid;
          let lengthT = tids.length;
          let tdiv_id = 'e_' + event.hashtag1 + '_' + event.hashtag2;

          const tChecked = tweetCheckedCount[tdiv_id]
            ? tweetCheckedCount[tdiv_id]
            : 0;
          let heading = classes.heading;
          let digit = classes.digit;
          if (lengthT - tChecked > level1Count) {
            tc = classes.sumMiddle;
            heading = classes.heading_black;
            digit = classes.digit_black;
          }
          if (lengthT - tChecked > level2Count) {
            tc = classes.sumHigh;
            heading = classes.heading;
            digit = classes.digit;
          }
          return (<ExpansionPanel key={tdiv_id} className={classes.filtersInline} onChange={(e, isEx) => {
              changeTweetEventCard(tdiv_id, isEx)
            }}>
            <ExpansionPanelSummary className={tc} expandIcon={<ExpandMoreIcon />}>
              <Typography className={heading}>{event.hashtag1}
                - {event.hashtag2}</Typography>
              <Typography className={digit}>Checked:{tChecked}&nbsp;&nbsp;Unchecked:{lengthT - tChecked}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails className={classes.detail}>
              <EventTweets id={this.props.id} tdiv_id={tdiv_id} tids={tids}/>
            </ExpansionPanelDetails>
          </ExpansionPanel>);
        })
      }
    </div>);

  }
};

EventContent.propTypes = {
  classes: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {tweetCheckedCount: state.ui.tweetCheckedCount, level1Count: state.ui.level1Count, level2Count: state.ui.level2Count}
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    changeTweetEventCard: changeTweetEventCard
  }, dispatch)
};

export default compose(withStyles(styles, {withTheme: true}), withTracker(({id, eventQuery, hashtagLists, fuzzyMatch}) => {
  if (id && hashtagLists && hashtagLists.length != 0) {
    // check status of job
    if (!this.minSeq) 
      this.minSeq = -1;
    const eventsHandle = Meteor.subscribe('events', id, eventQuery, hashtagLists, fuzzyMatch);
    const res = Events.find({
      id: id
    }, {
      sort: {
        "seq": -1
      }
    }).fetch();
    return {events: res};
  }
  return {};
}), connect(mapStateToProps, mapDispatchToProps,),)(EventContent);
