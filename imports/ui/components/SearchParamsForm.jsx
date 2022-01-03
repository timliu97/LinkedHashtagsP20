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
import Typography from 'material-ui/Typography';
import {fetchHistoryTweets} from "../actions/HashtagGraphActions";
import {withTracker} from 'meteor/react-meteor-data';
import langs from 'langs';
import {Meteor} from 'meteor/meteor'

let searchCountLimit = Meteor.settings["public"]["search"]["count_limit"];

const isLocation = value => value && !/^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/i.test(value)
  ? 'Invalid location'
  : undefined;

const number = value => value && isNaN(Number(value))
  ? 'Must be a number'
  : undefined;

const customParams = value => value && !/^([0-9A-Za-z-_]+=[0-9A-Za-z-_]+(&)?)+$/.test(value)
  ? 'Invalid format'
  : undefined;

const countLimit = value => value && (value > searchCountLimit)
  ? 'You\'ve exceeded the limit of ' + searchCountLimit
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

const resultTypes = [
  {
    value: 'mixed',
    label: 'Mixed'
  }, {
    value: 'recent',
    label: 'Recent'
  }, {
    value: 'popular',
    label: 'Popular'
  }
];

class SearchParamsForm extends Component {
  render() {
    if (this.props.isUserAdmin) {
      searchCountLimit = 99999999;
    }
    if (this.props.isUserSup){
    searchCountLimit = 10000;
    }
    if (this.props.isUserResearcher){
    searchCountLimit = 500;
    }
    const {
      fetchHistoryTweets,
      query,
      currentQuery,
      searchParamsValues,
      pristine,
      reset,
      submitting,
      classes,
      isUserResearcher,
      isUserAdmin,
      isUserSup
    } = this.props;
    const languages = langs.all();

    // if query has changed, notify user to submit search
    const hasQueryChanged = query !== currentQuery;
    const isQueryEmpty = currentQuery === '';

    return (<form onSubmit={(e) => {
        e.preventDefault();
        if (currentQuery !== '') {
          fetchHistoryTweets(currentQuery, searchParamsValues)
        }
      }}>
      <Grid container={true} className={classes.root}>
        <Grid item={true} xs={12}>
          <Grid container={true} justify="center">
            <Grid item={true}>
              <Card className={classes.card}>
                <CardContent>
                  <Typography className={classes.title}>Tweets</Typography>
                  <Field name="count" type="number" component={TextField} label="Count" fullWidth={true} margin="normal" helperText={"Defaults to 100, limited to " + searchCountLimit} validate={[number, countLimit, isPositive]}/>
                  {
                  isUserSup || isUserAdmin
                  ? <Field name="until" type="date" component={TextField} label="Until" fullWidth={true} margin="normal"/>
                  : ''
                  }
                    </CardContent>
                     </Card>
                      </Grid>
                      {
                      isUserAdmin || isUserSup
                  ? <Grid item={true}>
                    <Card className={classes.card}>
                    <CardContent>
                    <Typography className={classes.title}>Misc</Typography>
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
                    <FormControl className={classes.formControl} margin="normal">
                      <InputLabel htmlFor="language">Result Type</InputLabel>
                      <Field name="resultType" component={Select} fullWidth={true}>
                        {
                          resultTypes.map(option => (<MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>))
                        }
                      </Field>
                    </FormControl>
                    </CardContent>
                    </Card>
                    </Grid>
                    :''
                    }
                    {
                    isUserSup || isUserAdmin
                     ?<Grid item={true}>
                       <Card className={classes.card}>
                         <CardContent>
                           <Typography className={classes.title}>Nearby</Typography>
                           <Field name="location" type="text" component={TextField} label="Location" placeholder="eg. 48.866667,2.333333" helperText="latitude,longitude" fullWidth={true} margin="normal" validate={[isLocation]}/>
                           <Field name="distance" type="number" component={TextField} label="Distance" fullWidth={true} margin="normal" validate={[number]} helperText="Radius in km"/>
                         </CardContent>
                       </Card>
                     </Grid>
                     :''
                     }{
                     isUserAdmin || isUserSup
                     ? <Grid item={true}>
                       <Card className={classes.card}>
                         <CardContent>
                           <Typography className={classes.title}>Custom Params</Typography>
                           <Field name="customParams" placeholder="eg. since_id=12345" type="text" component={TextField} fullWidth={true} margin="normal" helperText="key=value pairs separated by ampersand (&)" validate={[customParams]}/>
                         </CardContent>
                         <CardActions>
                           <Button dense={true} href="https://developer.twitter.com/en/docs/tweets/search/api-reference/get-search-tweets" target="_blank">
                             Api Reference
                           </Button>
                         </CardActions>
                       </Card>
                     </Grid>
             : ''
             }
        <Grid item={true} xs={12} className={classes.searchParamsFormActions}>
          <Button disabled={pristine || submitting} onClick={reset} color="default">
            Clear All
          </Button>
          <Button raised={true} color="primary" type="submit" disabled={(pristine && !hasQueryChanged)} className={classes.button}>
            Search
          </Button>
        </Grid>
      </Grid>
      </Grid>
      </Grid>
    </form>)
  }
}

SearchParamsForm = reduxForm({
  form: 'SearchParams', // a unique identifier for this form
})(SearchParamsForm);

function mapStateToProps(state) {
  return {
    initialValues: state.hashtagGraph.params, query: state.hashtagGraph.query, currentQuery: state.hashtagGraph.currentQuery, searchParamsValues: getFormValues('SearchParams')(state)
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchHistoryTweets: fetchHistoryTweets
  }, dispatch)
}

export default compose(withTracker((props) => {
  const currentUser = Meteor.user();
  const userId = Meteor.userId();
  return {currentUser,
  isUserResearcher: Roles.userIsInRole(userId, 'researcher'),
  isUserAdmin: Roles.userIsInRole(userId, 'admin'),
  isUserSup: Roles.userIsInRole(userId,'superuser')
  }
}), withStyles(styles, {withTheme: true}), connect(mapStateToProps, mapDispatchToProps,),)(SearchParamsForm);
