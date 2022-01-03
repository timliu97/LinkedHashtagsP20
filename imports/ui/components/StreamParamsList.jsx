import React, {Component} from 'react';
import {connect} from "react-redux";
import {bindActionCreators, compose} from "redux";
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import Chip from 'material-ui/Chip';
import {change, formValueSelector} from 'redux-form' // ES6
import Avatar from 'material-ui/Avatar';
import {Meteor} from "meteor/meteor";
import {withTracker} from 'meteor/react-meteor-data';

const styles = theme => ({
  chip: {
    margin: theme.spacing.unit / 2
  },
  row: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginLeft: (theme.spacing.unit * 2) - (theme.spacing.unit / 2)
  },
  avatar: {
    fontSize: '0.75rem',
    width: 'auto',
    padding: '0 8px',
    borderRadius: '2px 0 0 2px'
  }
});

class StreamParamsList extends Component {
  styles = {
    chip: {
      margin: 4
    },
    wrapper: {
      display: 'flex',
      flexWrap: 'wrap'
    }
  };

  handleRequestDelete = data => () => {
    this.props.removeStreamParam('StreamParams', data, null);
  };

  render() {
    if (this.props.currentUser) {
      streamCountLimit = 99999999;
    }
    const {streamParams, classes} = this.props;

    return (<div className={classes.row}>
      {
        Object.keys(streamParams).map((item, i) => {
          if (streamParams[item].isDefined) { // don't render param if undefined or false
            return (<Chip avatar={<Avatar className = {
                classes.avatar
              } > {
                streamParams[item].label
              }
              </Avatar>
} label={streamParams[item].value} key={item} onDelete={this.handleRequestDelete(item)} className={classes.chip}/>);
          }
        })
      }
      </div>);
  }
}

StreamParamsList.propTypes = {
  classes: PropTypes.object.isRequired
};

let streamCountLimit = Meteor.settings["public"]["stream"]["count_limit"];

const isLocation = value => value && !/^((^|(?!^),)([-+]?([1-8]?\d(\.\d+)?|90(\.0+)?)),(\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?))){2}$/i.test(value)
  ? false
  : value;

const isCustomParams = value => value && !/^([0-9A-Za-z-_]+=[0-9A-Za-z-_]+(&)?)+$/.test(value)
  ? false
  : value;

const countLimit = value => value && (value < 0) || (value > streamCountLimit)
  ? false
  : value;

const selector = formValueSelector('StreamParams');

function mapStateToProps(state) {
  return {
    streamParams: {
      count: {
        label: 'count',
        value: selector(state, 'count'),
        isDefined: countLimit(selector(state, 'count'))
      },
      language: {
        label: 'language',
        value: selector(state, 'language'),
        isDefined: !!selector(state, 'language')
      },
      location: {
        label: 'location',
        value: selector(state, 'location'),
        isDefined: isLocation(selector(state, 'location'))
      },
      distance: {
        label: 'radius',
        value: selector(state, 'distance') + ' km',
        isDefined: !!selector(state, 'distance')
      },
      customParams: {
        label: 'custom',
        value: selector(state, 'customParams'),
        isDefined: isCustomParams(selector(state, 'customParams'))
      }
    }
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    removeStreamParam: change
  }, dispatch)
}

export default compose(withTracker((props) => {
  const currentUser = Meteor.user();

  return {currentUser};
}), withStyles(styles, {withTheme: true}), connect(mapStateToProps, mapDispatchToProps,),)(StreamParamsList);
