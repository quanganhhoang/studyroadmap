import React, { Component } from 'react'

import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    marginTop: 10,
    marginLeft: 20,
    marginRight: 40,
  },
  skills: {
    marginBottom: 20
  }
})

/**
 * FilterResult component inside of SearchResult
 */
class FilterResult extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkedItems: new Map(),
      numberOfGuests: 2
    };
  }

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.name === 'numVotes' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>

        <div>Number of Votes</div>
        <div>
          <label>
            <input
              name="numVotes"
              type="radio"
              checked={this.state.isGoing}
              onChange={this.handleInputChange}/> >200 <br />
            <input
              name="numVotes"
              type="radio"
              checked={this.state.isGoing}
              onChange={this.handleInputChange}/> 100-200 <br />
            <input
              name="numVotes"
              type="radio"
              checked={this.state.isGoing}
              onChange={this.handleInputChange}/>  <br />
          </label>
        </div>
        <br />
        <div>Number of Comments</div>
        <div>
          <label>
            <input
              name="numFeedback"
              type="radio"
              checked={this.state.isGoing}
              onChange={this.handleInputChange}/> >200 <br />
            <input
              name="numFeedback"
              type="radio"
              checked={this.state.isGoing}
              onChange={this.handleInputChange}/> 100-200 <br />
            <input
              name="numFeedback"
              type="radio"
              checked={this.state.isGoing}
              onChange={this.handleInputChange}/>  <br />
          </label>
        </div>
      </div>
    );
  }
}


export default withStyles(styles)(FilterResult);