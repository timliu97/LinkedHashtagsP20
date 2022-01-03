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
import {toggleHeatmap} from "../actions/UIActions";
import HeatMapLayer from './HeatMapLayer';
import Rnd from 'react-rnd';

const styles = theme => ({
  card: {
    //maxWidth: 400,
    width: "100%",
    height: '100%',
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
  hideDiv: {
    visibility: 'hidden',
    display: 'none'
  },
  show: {
    visibility: 'visible',
    display: 'block',
    opacity: 1
  },
  cardHeader: {
    position: 'fixed',
    width: "100%",
    maxHeight: 85,
    boxSizing: 'border-box',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    zIndex: 9,
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
    borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
    marginTop: -74
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

class HeatmapDataCard extends React.Component {
  render() {
    const {istoggleHeatmap, classes} = this.props;

    return (<Rnd style={{
        zIndex: 9999999999
      }} className={classNames(classes.hideDiv, istoggleHeatmap && classes.show)} default={{
        x: 0,
        y: 75,
        height: 300,
        width: 586
      }}>
      <Card className={classNames(classes.card, istoggleHeatmap && classes.show)}>
        <CardHeader title='HeatMap view (Use right click to move the map)' className={classes.cardHeader} action={<IconButton onClick = {
            () => this.props.toggleHeatmap(!istoggleHeatmap)
          } > <CloseIcon/>
        </IconButton>}/>
        <HeatMapLayer id={this.props.id}/>
      </Card>
    </Rnd>);
  }
}

HeatmapDataCard.propTypes = {
  classes: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {istoggleHeatmap: state.ui.istoggleHeatmap}
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    toggleHeatmap: toggleHeatmap
  }, dispatch)
}

export default compose(withStyles(styles, {withTheme: true}), connect(mapStateToProps, mapDispatchToProps,),)(HeatmapDataCard);
