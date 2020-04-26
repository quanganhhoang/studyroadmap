import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import Dashboard from './components/Dashboard'
import ResultCard from './components/ResultCard'
import SearchResult from './components/SearchResult'
import RoadMap from './components/Roadmap';
import RoadMapCreation from './components/RoadmapCreation'
class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            searchText: ""
        }
        this.handleSearch = this.handleSearch.bind(this);
    }

    handleSearch(searchText) {
        console.log(searchText);
        this.setState({searchText: searchText});
    }

    render() {
        return (
          <div>
            <NavBar handleSearch={this.handleSearch} />
             <BrowserRouter>
               <div>
             <Route exact path="/" component={LandingPage} />
             <Route exact path="/roadmap/:roadmapId" component={RoadMap} />
             <Route exact path="/searchresult"  component={() => <SearchResult parentState={this.state} />} />
                </div>
            </BrowserRouter>
            <Footer />
          </div>
        )
    }
}
export default App;

// <BrowserRouter>
//           <div>
//             <Route exact path="/" component={LandingPage} />
//             <Route exact path="/dashboard" component={RoadMap} />
//             <Route exact path="/searchresult" component={SearchResult} />
//           </div>
//         </BrowserRouter>