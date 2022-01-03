import React, {Component} from 'react';
import {bindActionCreators, compose} from 'redux';
import {withStyles} from 'material-ui/styles';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Dialog, {DialogActions, DialogContent, DialogContentText, DialogTitle, withMobileDialog} from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui-icons/Close';
import Slide from 'material-ui/transitions/Slide';
import {toggleInfoDialog} from "../actions/UIActions";
import Table, {TableBody, TableCell, TableHead, TableRow} from 'material-ui/Table';

const styles = theme => ({
  root: {
    color: theme.palette.primary[500],
    textDecoration: 'inherit',
    '&:hover': {
      textDecoration: 'underline'
    }
  },
  button: {
    margin: theme.spacing.unit,
    position: 'absolute',
    top: 0,
    right: 0
  },
  aboutContent: {
    padding: 0
  },
  aboutText: {
    fontSize: '0.9rem',
    padding: theme.spacing.unit * 2,
    paddingBottom: 0,
    textAlign: 'center'
  },
  aboutTextCredit: {
    fontSize: '0.9rem',
    padding: theme.spacing.unit * 2,
    paddingTop: 0,
    textAlign: 'center'
  },
  tableInfoText: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center'
  }
});

let id = 0;

function createData(operator, signification) {
  id += 1;
  return {id, operator, signification};
}

const data = [
  createData('#hashtag', 'containing the hashtag "hashtag"'),
  createData('#hashtag -RT', 'containing "hashtag" exclude retweets'),
  createData('#hashtag1 #hashtag2', 'containing both hashtags hashtag1 and hashtag2'),
  createData('#hashtag1 OR #hashtag2', 'containing either hashtag hashtag1 or hashtag2 (or both)'),
  createData('#hashtag1 -#hashtag2', 'containing “hashtag1” but not "hashtag2"')
];

function MyLink(props) {
  const {
    children,
    classes,
    className,
    variant,
    sheet,
    theme,
    ...other
  } = props;

  return (<a target="_blank" className={classNames(classes.root, className)} {...other}>
    {children}
  </a>);
}

const MyLinkStyled = withStyles(styles)(MyLink);

function Transition(props) {
  return <Slide direction="down" {...props}/>;
}

class InfoDialog extends Component {

  render() {
    const {fullScreen, classes} = this.props;

    return (<Dialog fullScreen={fullScreen} transition={Transition} open={this.props.infoDialogOpen} onClose={() => this.props.toggleInfoDialog(false)}>
      <DialogTitle>{"About (v0.9.0-alpha.1)"}</DialogTitle>
      <IconButton onClick={() => this.props.toggleInfoDialog(false)} className={classes.button} aria-label="Close">
        <CloseIcon/>
      </IconButton>
      <DialogContent className={classes.aboutContent}>
        <DialogContentText className={classes.aboutText}>
          {'LinkedHashtags is a research project at the '}
          <MyLinkStyled href="http://www.utt.fr/">
            University of Technology of Troyes (UTT).
          </MyLinkStyled>
        </DialogContentText>
        <DialogContentText className={classes.aboutTextCredit}>
          {'Developed by '}
          <MyLinkStyled href="https://github.com/yassinedoghri">
            {'Yassine Doghri'}
          </MyLinkStyled>
          {' and supervised by '}
          <MyLinkStyled href="https://github.com/BabigaBirregah">
            {'Babiga Birrega'}
          </MyLinkStyled>.
        </DialogContentText>
        <DialogContentText className={classes.tableInfoText}>
          {'Below is a table of examples on how to build a complex query.'}
        </DialogContentText>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Operator</TableCell>
              <TableCell>Signification</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              data.map(n => {
                return (<TableRow key={n.id}>
                  <TableCell>{n.operator}</TableCell>
                  <TableCell>{n.signification}</TableCell>
                </TableRow>);
              })
            }
          </TableBody>
        </Table>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => this.props.toggleInfoDialog(false)} color="primary" autoFocus="autoFocus">
          Ok, Got it!
        </Button>
      </DialogActions>
    </Dialog>);
  }
}

InfoDialog.propTypes = {
  fullScreen: PropTypes.bool.isRequired
};

function mapStateToProps(state) {
  return {infoDialogOpen: state.ui.infoDialogOpen}
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    toggleInfoDialog: toggleInfoDialog
  }, dispatch)
}

export default compose(withMobileDialog(), withStyles(styles), connect(mapStateToProps, mapDispatchToProps,),)(InfoDialog);
