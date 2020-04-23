import React, { Component } from 'react';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import MuiAppBar from '@material-ui/core/AppBar';

const styles = (theme) => ({
  root: {
    color: theme.palette.common.white,
  },
});

class AppBar extends Component {
  renderContent() {
    switch (this.props.auth) {
      case null:
        return 'Still deciding';
      case false:
        return 'im logged out';
      default:
        return 'im logged in';
    }
  }
  
  render() {
    return (
      <MuiAppBar elevation={0} position="static" {...this.props} />
    )
  }
}

AppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    auth: state.auth,
  }
}

export default withStyles(styles)(connect(mapStateToProps)(AppBar));
// export default compose(
//   connect(
//     mapStateToProps,
//     null,
//   ),
//   withStyles(styles)
// )(AppBar);