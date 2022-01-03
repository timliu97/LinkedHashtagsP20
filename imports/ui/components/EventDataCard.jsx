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
import BeenHere from 'material-ui-icons/Beenhere';
import Check from 'material-ui-icons/Check';
import IconButton from 'material-ui/IconButton';
import Button from 'material-ui/Button';
import FavoriteIcon from 'material-ui-icons/Favorite';
import RetweetIcon from 'material-ui-icons/Repeat';
import ArrowDownward from 'material-ui-icons/ArrowDownward';
import Typography from 'material-ui/Typography';
import Highlighter from 'react-highlight-words';
import moment from 'moment';
import {blueGrey} from 'material-ui/colors';
import CloseIcon from 'material-ui-icons/Close';
import {
  toggleEventDataCard,
  setEventHashtagList,
  setLevel1Count,
  setLevel2Count,
  changeViewTweet,
  changeIsFuzzy
} from "../actions/UIActions";
import {Events} from "../../api/graphs";
import Event from 'material-ui-icons/Event';
import SearchBar from 'material-ui-search-bar'
import ExpansionPanel, {ExpansionPanelDetails, ExpansionPanelSummary, ExpansionPanelActions} from 'material-ui/ExpansionPanel';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import EventContent from './EventContent'
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';

const styles = theme => ({
  card: {
    maxWidth: 410,
    width: 410,
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
    width: 410,
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
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
    color: 'grey'
  },
  filtersInline: {
    paddingLeft: 0,
    listStyle: 'none',
    margin: 0
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
    right: '12px'
  }
});

class EventDataCard extends React.Component {
  render() {
    const {
      toggleEventDataCard,
      showEventDataCard,
      graphMetadata,
      hashtagLists,
      eventQuery,
      isFuzzy,
      setEventHashtagList,
      id,
      viewCheckedTweet,
      classes
    } = this.props;

    return (<Card className={classNames(classes.card, showEventDataCard && classes.show)}>
      <CardHeader title='Stream event' subheader={'Number of event: ' + graphMetadata.numberOfEdges} className={classes.cardHeader} action={<IconButton onClick = {
          () => toggleEventDataCard(false, id)
        } > <CloseIcon/>
      </IconButton>}/>
      <CardContent>
        <SearchBar onRequestSearch={setEventHashtagList} placeholder={"w1,w2...|w3,w4...;w5|w6;..."} style={{
            margin: '0 auto',
            maxWidth: '100%',
            width: '100%',
            borderRadius: '2px',
            marginBottom: '15px'
          }} value={eventQuery
            ? eventQuery
            : ""}/>
        <div align="center">
          <TextField id="color1" label="Level 1 event count" defaultValue={'10'} onChange={(event) => {
              (event.target.value < 0)
                ? event.target.value = 0
                : this.props.setLevel1Count(event.target.value)
            }} type="number" margin="normal" style={{
              width: 150
            }}/>&nbsp;&nbsp;&nbsp;
          <TextField id="color2" label="Level 2 event count" defaultValue={'20'} onChange={(event) => {
              (event.target.value < 0)
                ? event.target.value = 0
                : this.props.setLevel2Count(event.target.value)
            }} type="number" margin="normal" style={{
              width: 150
            }}/>
        </div>
        <div align="center">
          <Button onClick={() => this.props.changeViewTweet(!viewCheckedTweet)} raised={true} color="primary">
            {
              viewCheckedTweet
                ? <BeenHere/>
                : <Check/>
            }
            {
              viewCheckedTweet
                ? 'View new tweet'
                : 'View checked tweet'
            }
          </Button>
          <Checkbox checked={isFuzzy} onChange={(e, x) => {
              this.props.changeIsFuzzy(x);
            }} color="primary"/>
          Fuzzy
        </div>
        <br/> {
          hashtagLists
            ? <EventContent id={id} eventQuery={eventQuery} hashtagLists={hashtagLists} fuzzyMatch={isFuzzy}/>
            : null
        }
      </CardContent>
    </Card>);
  }
}

EventDataCard.propTypes = {
  classes: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    graphMetadata: state.hashtagGraph.graphMetadata,
    showEventDataCard: state.ui.showEventDataCard,
    hashtagLists: state.ui.eventHashtagList,
    eventQuery: state.ui.eventQuery,
    viewCheckedTweet: state.ui.viewCheckedTweet,
    isFuzzy: state.ui.isFuzzy
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    toggleEventDataCard: toggleEventDataCard,
    setEventHashtagList: setEventHashtagList,
    setLevel1Count: setLevel1Count,
    setLevel2Count: setLevel2Count,
    changeViewTweet: changeViewTweet,
    changeIsFuzzy: changeIsFuzzy
  }, dispatch)
}

export default compose(withStyles(styles, {withTheme: true}), connect(mapStateToProps, mapDispatchToProps,),)(EventDataCard);
