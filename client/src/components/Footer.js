import React, { Component } from 'react'

/**
 * Fixed footer component
 */
class Footer extends Component {
  render() {
    return (
      <div className="container" style={{minHeight: "100px"}}>
        <div className="row" style={{marginTop: "20px"}}>
            <div className="col-md-3">
                <img src="/logo.svg" style={{maxWidth:"100%"}}/> <br />
                <span style={{fontSize: "11px", color:"#637381"}}>Personalize the best roadmap for any discipline </span>
            </div>
            <div className="col-md-3 offset-sm-0">
                <span style={{fontSize: "16px"}}> About Us </span> <br />
                <a href="#" style={{fontSize: "12px"}}>Mission</a> <br />
                <a href="#" style={{fontSize: "12px"}}>Vision</a> <br />
                <a href="#" style={{fontSize: "12px"}}>Team</a> <br />
            </div>
            <div className="col-md-3">
                 <span style={{fontSize: "16px"}}> Blog </span> <br />
                <a href="#" style={{fontSize: "12px"}}>Tech</a> <br />
                <a href="#" style={{fontSize: "12px"}}>FAQ</a> <br />
            </div>
            <div className="col-md-3">
                <span style={{fontSize: "16px"}}> Contact </span> <br />
                <a href="#" style={{fontSize: "12px"}}>support@polaris.com</a> <br />
            </div>
        </div>
      </div>
    );
  }
}

export default Footer;