import React, {Component} from 'react';
import {MenuItem, MenuList} from 'material-ui/Menu';
import {bindActionCreators, compose} from 'redux';
import {connect} from 'react-redux';
import {withStyles} from "material-ui/styles";
import PropTypes from 'prop-types';
import {toggleGraphFilters} from '../actions/UIActions';
import {setMinWeightFilter, updateSettings} from "../actions/HashtagGraphActions";
import TextField from 'material-ui/TextField';
import {FormControlLabel} from 'material-ui/Form';
import Switch from 'material-ui/Switch';

const styles = theme => ({
  menuItem: {
    width: 220
  }
});

class MenuGraphFilters extends Component {

  render() {
    const {
      graphFiltersAnchorEl,
      updateSettings,
      minWeightFilter,
      classes,
      nSettings,
      Stimestamp
    } = this.props;
    const open = Boolean(graphFiltersAnchorEl);

    return (<MenuList role="menu">
      <MenuItem>
        <FormControlLabel control={<Switch
          checked = {
            nSettings['drawEdgeLabels']
              ? true
              : false
          }
          onChange = {
            () => updateSettings({
              drawEdgeLabels: nSettings['drawEdgeLabels']
                ? false
                : true
            })
          }
          />} label="Draw edge labels?"/>
      </MenuItem>
      <MenuItem>
        <FormControlLabel control={<Switch
          checked = {
            nSettings['drawEdges'] == undefined
              ? true
              : nSettings['drawEdges']
          }
          onChange = {
            () => updateSettings({
              drawEdges: nSettings['drawEdges'] == undefined
                ? false
                : !nSettings['drawEdges']
            })
          }
          />} label="Draw edge?"/>
      </MenuItem>
      <MenuItem>
        <TextField id="number_min_display" label="The minimum size a node to show label" defaultValue={nSettings['labelThreshold']
            ? nSettings['labelThreshold']
            : '5'} onChange={(event) => {
            (event.target.value < 0)
              ? event.target.value = 0
              : updateSettings({labelThreshold: event.target.value})
          }} type="number" margin="normal" className={classes.menuItem}/>
      </MenuItem>
      <MenuItem>
        <TextField id="number_min_weight" label="Number minimum of weight to display" defaultValue={minWeightFilter.toString()} onChange={(event) => {
            (event.target.value < 0)
              ? event.target.value = 0
              : this.props.setMinWeightFilter(event.target.value)
          }} type="number" margin="normal" className={classes.menuItem}/>
      </MenuItem>
    </MenuList>);
  }
}

MenuGraphFilters.propTypes = {
  classes: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {minWeightFilter: state.hashtagGraph.minWeightFilter, nSettings: state.hashtagGraph.nSettings, Stimestamp: state.hashtagGraph.Stimestamp, graphFiltersAnchorEl: state.ui.graphFiltersAnchorEl}
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    toggleGraphFilters: toggleGraphFilters,
    setMinWeightFilter: setMinWeightFilter,
    updateSettings: updateSettings
  }, dispatch)
}

export default compose(withStyles(styles, {withTheme: true}), connect(mapStateToProps, mapDispatchToProps,),)(MenuGraphFilters);
