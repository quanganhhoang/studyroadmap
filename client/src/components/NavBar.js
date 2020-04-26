import React, { Component } from 'react'

/**
 * Fixed navbar component
 * 
 * Child components:
 * 
 * SearchBar
 */

const centerStyle = {
    verticalAlign: "middle"
}

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.handleSearch = this.handleSearch.bind(this);
  }

  handleSearch(e) {
    e.preventDefault();
    this.props.handleSearch(e.target.value);
  }

  render() {
    return (
      <div className="container-fluid" style={{minHeight: "50px", "boxShadow": "0 0 5px rgba(0, 0, 0, 0.2)"}} >
        <div className="row" >
            <div className="col-sm-1"><img src="/logo.svg" style={{maxWidth:"100%", ...centerStyle}}/></div>
            <div className="col-sm-2"> <input style={{marginTop: "10px", width:"100%"}} onChange={this.handleSearch} className="corner" type="text" placeholder=" &#128269; Search.."/></div>
            <div className="col-sm-2 offset-lg-7">
                <div className="row"> 
                    <div className="col-lg-6" style={{marginTop: "10px"}}>My Roadmaps</div>
                    <div className="col-lg-6" style={{marginTop: "10px"}}><img style={{borderRadius: "50%", maxWidth:"20%"}} src="https://www.computerhope.com/jargon/g/guest-user.jpg"/></div>
                </div>
            </div>
        </div>
      </div>
    );
  }
}

export default NavBar;