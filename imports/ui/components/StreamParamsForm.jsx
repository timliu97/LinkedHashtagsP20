/* eslint-disable flowtype/require-valid-file-annotation */

import React, {Component} from 'react';
import {Field, getFormValues, reduxForm} from 'redux-form';
import {connect} from "react-redux";
import {bindActionCreators, compose} from "redux";
import {FormControl} from 'material-ui/Form';
import {MenuItem} from 'material-ui/Menu';
import Button from 'material-ui/Button';
import Card, {CardActions, CardContent} from 'material-ui/Card';
import Grid from 'material-ui/Grid';
import {Select, TextField} from 'redux-form-material-ui';
import {InputLabel} from 'material-ui/Input'
import {withStyles} from 'material-ui/styles';
import {withTracker} from 'meteor/react-meteor-data';
import Typography from 'material-ui/Typography';
import langs from 'langs';
import {createJob} from "../actions/JobsActions";
import {Meteor} from "meteor/meteor";

let streamCountLimit = Meteor.settings["public"]["stream"]["count_limit"];

const isLocation = value => value && !/^((^|(?!^),)([-+]?([1-8]?\d(\.\d+)?|90(\.0+)?)),(\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?))){2}$/i.test(value)
  ? 'Invalid location'
  : undefined;

const number = value => value && isNaN(Number(value))
  ? 'Must be a number'
  : undefined;

const customParams = value => value && !/^([0-9A-Za-z-_]+=[0-9A-Za-z-_]+(&)?)+$/.test(value)
  ? 'Invalid format'
  : undefined;

const countLimit = value => value && (value > streamCountLimit)
  ? 'You\'ve exceeded the limit of ' + streamCountLimit
  : undefined;

const isPositive = value => value && (value < 0)
  ? 'Must be positive'
  : undefined;

const styles = theme => ({
  root: {
    flexGrow: 1,
    marginTop: theme.spacing.unit * 2
  },
  searchParamsFormFrame: {
    width: '100%'
  },
  title: {
    fontSize: 14,
    color: theme.palette.text.secondary
  },
  form: {
    width: '50%',
    margin: 'auto'
  },
  formControl: {
    width: '100%'
  },
  selectList: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2
  },
  card: {
    minWidth: 275,
    width: 275
  },
  searchParamsFormActions: {
    textAlign: 'right'
  }
});

class StreamParamsForm extends Component {
  render() {
    if (this.props.currentUser) {
      streamCountLimit = 99999999;
    }
    const {
      createJob,
      query,
      currentQuery,
      streamParamsValues,
      pristine,
      reset,
      submitting,
      classes,
      isUserAdmin,
      isUserResearcher,
      isUserGuest,
      isUserSup
    } = this.props;
    const languages = langs.all();

    // if query has changed, notify user to submit search
    const hasQueryChanged = query !== currentQuery;
    const isQueryEmpty = currentQuery === '';

    return (
    <form onSubmit={(e) => {
        e.preventDefault();
        if (currentQuery !== '') {
          createJob('streamTweets', {
            track: currentQuery,
            ...streamParamsValues
          });
        }
      }}>
      <Grid container={true} className={classes.root}>
        <Grid item={true} xs={12}>
          <Grid container={true} justify="center">
            <Grid item={true}>
              <Card className={classes.card}>
                <CardContent>
                  <Typography className={classes.title}>Tweets</Typography>
                  <Field name="count" type="number" component={TextField} label="Count" fullWidth={true} margin="normal" helperText={"Defaults to 100, limited to " + streamCountLimit} validate={[number, countLimit, isPositive]}/>
                  <FormControl className={classes.formControl} margin="normal">
                    <InputLabel htmlFor="language">Language</InputLabel>
                    <Field name="language" component={Select} fullWidth={true}>
                      {
                        languages.map(option => (<MenuItem key={option["1"]} value={option["1"]}>
                          {option["name"]}
                        </MenuItem>))
                      }
                    </Field>
                  </FormControl>
                </CardContent>
              </Card>
            </Grid>
            <Grid item={true}>
              <Card className={classes.card}>
                <CardContent>
                  <Typography className={classes.title}>Location</Typography>
                  <Field name="location" type="text" component={TextField} label="Bounding Box" placeholder="eg. 2.2,48.8,2.5,48.9" helperText="4 borders separated by comma (CSV) in the following order: West, South, East, North" fullWidth={true} margin="normal" validate={[isLocation]}/>
                </CardContent>
                <CardActions>
                  <Button dense={true} href="http://boundingbox.klokantech.com/" target="_blank">
                    Find Bounding Box
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            <Grid item={true}>
              <Card className={classes.card}>
                <CardContent>
                  <Typography className={classes.title}>Custom Params</Typography>
                  <Field name="customParams" placeholder="eg. follow=12345" type="text" component={TextField} fullWidth={true} margin="normal" helperText="key=value pairs separated by ampersand (&)" validate={[customParams]}/>
                </CardContent>
                <CardActions>
                  <Button dense={true} href="https://developer.twitter.com/en/docs/tweets/filter-realtime/api-reference/post-statuses-filter.html" target="_blank">
                    Api Reference
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
        </Grid>
        <Grid item={true} xs={12} className={classes.searchParamsFormActions}>
          <Button disabled={pristine || submitting} onClick={reset} color="default">
            Clear All
          </Button>
          <Button raised={true} color="primary" type="submit" disabled={(pristine && !hasQueryChanged)} className={classes.button}>
            Stream
          </Button>
        </Grid>
      </Grid>
    </form>
    )
  }
}

StreamParamsForm = reduxForm({
  form: 'StreamParams', // a unique identifier for this form
})(StreamParamsForm);

function mapStateToProps(state) {
  return {
    initialValues: state.hashtagGraph.params, query: state.hashtagGraph.query, currentQuery: state.hashtagGraph.currentQuery, streamParamsValues: getFormValues('StreamParams')(state)
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    createJob: createJob
  }, dispatch)
}

export default compose(withTracker((props) => {
  const currentUser = Meteor.user();
  const userId = meteor.userId();

  return {currentUser,
  isUserResearcher: Roles.userIsRole(userId,'researcher'),
  isUserAdmin: Roles.userIsInRole(userId, 'admin'),
  isUserGuest: Roles.userIsInRole(userId, 'guest'),
  isUserSup: Roles.userIsInRole(userId, 'superuser')


};
}), withStyles(styles, {withTheme: true}), connect(mapStateToProps, mapDispatchToProps,),)(StreamParamsForm);
