import React, { Component } from 'react'

import ResultCard from './ResultCard'
import FilterResult from './FilterResult'
import { Link } from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    display: 'flex',
    marginLeft: 10,
    marginTop: 50
  },
  filter: {
    borderRadius: 5,
    // box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.05); 
    backgroundColor: '#ffffff',
    padding: 20,
    margin: 20,
    borderCorlor: '#ffebee',
    borderRadius: 2,
  },
  results: {
    // box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.05);
    backgroundColor: '#ffffff',
    borderCorlor: '#ffebee',
    width: "100%",
    textAlign: 'left',
  },
  pageLinks: {
    display: 'block',
    textAlign: 'center',

  }
})
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}
/**
 * Child components:
 * 
 * Card
 * FilterResult
 */
class SearchResult extends Component {
  constructor(props) {
    super(props);
    this.handleSearchApi = this.handleSearchApi.bind(this);
    this.searchUpdateRoutine = this.searchUpdateRoutine.bind(this);
    this.currentSearchText = "";
    this.state = {
      results : []
    }
  }

  componentDidMount() {
    this.searchUpdateRoutine();
  }

  searchUpdateRoutine() {
    if(this.currentSearchText != this.props.parentState.searchText) {
      console.log("here")
      this.handleSearchApi().then(() => setTimeout(()=> this.searchUpdateRoutine(), 200));
    } else {
      setTimeout(()=> this.searchUpdateRoutine(), 200);
    }
  }

  async handleSearchApi() {
    console.log(this.props.parentState.searchText)
    await fetch("/api/roadmap/search?query="+this.props.parentState.searchText)
    .then(r => r.json())
    .then(json => {
      this.currentSearchText = this.props.parentState.searchText;
      if(json.status) {
        this.setState({results: json.response});
      }
      console.log(json)
    })
    .catch(e => console.error(e));
  }

  componentWillReceiveProps(nextProps) {
    console.log("here1");
    if(this.props.searchText != nextProps.searchText){

      this.handleSearch(nextProps.searchText);
    }
  }
  render() {
    let numResults = this.state.results.length;
    const { classes } = this.props;
    let resultCards = this.state.results.map((r,i) => {
      return (
         <ResultCard key={r._id}
                  roadmapId={r._id}
                  title={r.name} 
                  description={r.description}
                  votes={r.votes}
                  tags={r.tags.map(tag => "#"+tag.name)}
                  matchPercentage={getRandomArbitrary((this.state.results.length - i) / (this.state.results.length + 1), (this.state.results.length - i + 1) / (this.state.results.length + 1)) * 100} 
                  numComments={Math.floor(Math.random() * Math.floor(1000))}
                />
      );
    })
    return (
      <div className="container-fluid" style={{paddingTop: "20px"}}>
        <div className="row">
          <div className="col-md-3">
            <FilterResult className={classes.filter}/>
          </div>
          <div className="col-lg-7">
            <div className={classes.results}>
              <div style={{}}> About {numResults} results... </div>
              <div>
                {resultCards}
              </div>
              <div className={classes.pageLinks}>
                <Link to="#"> 1 </Link>
                <Link to="#"> 2 </Link>
                <Link to="#"> 3 </Link>
                ...
              </div>

            </div>
          </div>
        </div>
      </div>
    );
  }
}


export default withStyles(styles)(SearchResult);