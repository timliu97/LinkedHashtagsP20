// For top users
import React from "react";
import {withProps} from "recompose";
import {withTracker} from 'meteor/react-meteor-data';
import {compose} from "redux"
import PropTypes from 'prop-types';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {withStyles} from 'material-ui/styles';
import classNames from 'classnames';
import {HorizontalBar} from 'react-chartjs-2';

const styles = theme => ({});

var topUsersData = {
  labels: [],
  datasets: [
    {
      label: 'TopUsers',
      backgroundColor: 'rgb(135, 135, 211)',
      borderColor: 'rgb(135, 135, 211)',
      borderWidth: 1,
      hoverBackgroundColor: 'rgb(60, 60, 215)',
      hoverBorderColor: 'rgb(60, 60, 215)',
      data: []
    }
  ]
};

class DashboardTopUsers extends React.Component {
  render() {
    const {topUsers, classes} = this.props;
    topUsersData.labels = [];
    topUsersData.datasets[0].data = [];
    topUsers.forEach(x => {
      topUsersData.labels.push(x.username);
      topUsersData.datasets[0].data.push(x.tweetCount);
    })
    console.log(topUsersData);
    return (<HorizontalBar data={topUsersData} options={{
        scales: {
          xAxes: [
            {
              ticks: {
                beginAtZero: true
              }
            }
          ]
        }
      }}/>);
  }
}

DashboardTopUsers.propTypes = {
  classes: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {topUsers: state.hashtagGraph.topUsers};
}

export default compose(withStyles(styles, {withTheme: true}), connect(mapStateToProps,),)(DashboardTopUsers);
