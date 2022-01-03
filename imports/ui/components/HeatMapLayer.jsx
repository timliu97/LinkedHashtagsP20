import React from "react";
import {withProps} from "recompose";
import {withTracker} from 'meteor/react-meteor-data';
import {compose} from "redux"
import PropTypes from 'prop-types';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {withStyles} from 'material-ui/styles';
import classNames from 'classnames';
import {withScriptjs, withGoogleMap, GoogleMap, Marker} from "react-google-maps"
import HeatmapLayer from "react-google-maps/lib/components/visualization/HeatmapLayer";
import MarkerWithLabel from "react-google-maps/lib/components/addons/MarkerWithLabel";
import {GeoHeatmap} from '../../api/graphs';

const getLabel = function(labels) {
  const len = labels.length;
  let i = 0;
  let res = labels[0];
  for (i = 1; i < len; i++) {
    if (i % 3 == 0) {
      res += "\n";
    }
    res += " ," + labels[i];
  }
  return res;
}

const HeatMap = compose(withProps({
  googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyC3qCR2EMmabJJuLNasOSuM8mdyF2-0Thc&v=3.exp&libraries=geometry,drawing,places,visualization", loadingElement: <div style={{
      height: `100%`
    }}/>,
  containerElement: <div style={{
      height: `100%`
    }}/>,
  mapElement: <div style={{
      height: `100%`
    }}/>,
  getLabel: getLabel
}), withScriptjs, withGoogleMap)((props) => <GoogleMap defaultZoom={1} defaultCenter={{
    lat: 0,
    lng: 0
  }}>
  {
    props.mode == 0
      ? <HeatmapLayer data={props.data}/>
      : props.data.map(cod => (<MarkerWithLabel key={cod[2]} position={cod[0]} labelAnchor={new google.maps.Point(30, 0)} labelStyle={{
          backgroundColor: "grey",
          fontSize: "14px",
          padding: "5px"
        }}>
        <div>{props.getLabel(cod[1])}</div>
      </MarkerWithLabel>))
  }
</GoogleMap>);

const styles = theme => ({});

class HeatMapLayer extends React.Component {
  render() {
    const geoData = this.props.geoData;
    const mode = this.props.mode;

    let datas = [];
    if (geoData && geoData.length != 0) {
      const lenGeoData = geoData.length;
      let i = 0;
      for (i = 0; i < lenGeoData; i++) {
        const cod = geoData[i].location.coordinates;
        if (mode == 0) {
          datas.push({
            location: new google.maps.LatLng(cod[1], cod[0]),
            weight: geoData[i].hashtags.length
          });
        } else {
          datas.push([
            new google.maps.LatLng(cod[1], cod[0]),
            geoData[i].hashtags,
            i
          ]);
        }
      }
    }
    if (!this.props.id) {
      const tweets = this.props.tweets;
      if (tweets && tweets.length != 0) {
        const lent = tweets.length;
        let i = 0;
        for (i = 0; i < lent; i++) {
          const geoinfo = tweets[i].geoInfo
          const isGeoed = geoinfo.hasGeoinfo;
          if (isGeoed) {
            if (mode == 0) {
              datas.push({
                location: new google.maps.LatLng(geoinfo.y, geoinfo.x),
                weight: tweets[i].hashtags.length
              });
            } else {
              datas.push([
                new google.maps.LatLng(geoinfo.y, geoinfo.x),
                tweets[i].hashtags,
                i
              ]);
            }
          }
        }
      }
    }
    return (<HeatMap data={datas} mode={mode}/>)
  }
}

HeatMapLayer.propTypes = {
  classes: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {tweets: state.hashtagGraph.tweets, mode: state.ui.HeatmapMode}
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch)
}
export default compose(withStyles(styles, {withTheme: true}), withTracker(({id}) => {
  if (id) {
    // Get geo data
    const heatmapData = Meteor.subscribe('geoHeatmap', id);
    const geoData = GeoHeatmap.find({gid: id}).fetch();
    return {geoData: geoData};
  }
  return {}
}), connect(mapStateToProps, mapDispatchToProps,),)(HeatMapLayer);
