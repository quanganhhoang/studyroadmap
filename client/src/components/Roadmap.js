import React, { Component } from 'react';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';
import UserBox from './UserProfileCard.js'
import { withRouter, useParams, Link } from "react-router-dom";

const breaks = require('remark-breaks');

const TimeLine = styled.ul`
    list-style-type: none;
    position: relative;
    padding-left: 4.6rem;

    &:before {
        content: ' ';
        background: #C0C0C0;
        display: inline-block;
        position: absolute;
        left: 16px;
        width: 20px;
        height: 100%;
        z-index: 400;
        border-radius: 1rem;
    }
`

const TimeLineItem = styled.li`
    margin: 40px 0;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 5px;
    &:before {
        content: ' ';
        background: #ddd;
        display: inline-block;
        position: absolute;
        border-radius: 50%;
        border: 3px solid #fff;
        left: 6px;
        width: 40px;
        height: 40px;
        z-index: 400;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    }
`

const TimeLineArrow = styled.div`
    border-top: 1.5rem solid transparent;
    border-right: 1.5rem solid #C0C0C0;
    border-bottom: 1.5rem solid transparent;
    display: block;
    position: absolute;
    left: 3.0rem;
`



function Image(props) {
  return <img {...props} style={{maxWidth: '100%'}} />
}
/**
 * This is a component displaying a roadmap post
 * 
 * Child components:
 * RoadmapNode
 */
class Roadmap extends Component {
    constructor(props) {
        super(props);
        this.populatePage = this.populatePage.bind(this);
        this.state = {}
    }

    populatePage(roadmapId) {
        fetch("/api/roadmap/get?id="+roadmapId)
        .then(r => r.json())
        .then(json =>  {
            if(json.status) {
                this.setState(json.response);
            }
            console.log(json.response.description)
            console.log(json);
        }).catch(e => console.error(e));
    }

    componentDidMount() {
        let roadmapId = this.props.match.params.roadmapId;
        this.populatePage(roadmapId);
    }

    render() {
        let milestones = []
        if(this.state.milestones) {
            milestones = this.state.milestones.map((m,i) => {
                    console.log(m.author_tip.content);
                    return (
                        <TimeLineItem key={m._id} className="rounded ml-3 p-4 shadow">
                                        <h2 className="h5 mb-0">{m.name}</h2>
                                        <a data-toggle="collapse" href={"#milestone"+i} role="button" aria-expanded="false" aria-controls={"milestone"+i}>
                                            View author guide
                                        </a> <br/>
                                        <div className="collapse" id={"milestone"+i}>
                                            <ReactMarkdown source={m.author_tip.content.replace(/\\n/g, "  \n")} parserOptions={{ commonmark: true }} renderers={{image: Image}}/>
                                        </div>
                                        <div className="row">
                                            <a className="col-sm-2" href="#"><i class="fas fa-comment"></i> View comments ({this.state.comments.length}) </a>
                                            <a className="col-sm-2" href="#"><i class="fas fa-reply"></i> Reply to this guide </a>
                                            <div style={{marginLeft: "auto"}}>
                                                <a className="col-md-3"  href="#">&#128214; Find partners </a> 
                                                <a className="col-md-3"  href="#"><i class='fas fa-user-graduate'></i> Find mentors </a>
                                            </div>
                                        </div>
                        </TimeLineItem>
                    );
            });
        }
        return (
            <div className="container-fluid" style={{paddingTop: "20px"}}>
                <div className="row">
                    <div className="col-lg-6" style={{marginLeft: "auto"}}>
                        <div style={{width: "100%"}}>
                             <h1>{this.state.name}</h1>
                            <p className="text-small mt-1 font-weight-light"> <ReactMarkdown source={this.state.description ? this.state.description.replace(/\\n/g, "  \n") : null} parserOptions={{ commonmark: true }} renderers={{image: Image}}/></p>
                            <button type="button" className="btn btn-outline-primary" style={{margin: "5px"}}>Share</button>
                            <button type="button" className="btn btn-outline-secondary" style={{margin: "5px"}}>Copy & Customize</button>
                            <button type="button" className="btn btn-outline-success" style={{margin: "5px"}}>Get Started!</button>

                            <p>Tags: {this.state.tags ? this.state.tags.map(tag => tag.name).join(", ") : ""}</p>

                        </div>
                    </div>
                    <div className="col-lg-2" style={{marginLeft: "auto", marginRight: "auto"}}>
                        <div style={{textAlign: "center"}}>
                            <UserBox />
                        </div>
                    </div>
                </div>
                <br/>
                <div className="row">
                        <div className="col-lg-10" style={{marginLeft: "auto", marginRight: "auto"}}>
                            <h5>Roadmap</h5>
                            <TimeLine>
                                {milestones}
                            </TimeLine>
                        </div>
                       
                </div>
            </div>

        )
    }
}

export default withRouter(Roadmap);