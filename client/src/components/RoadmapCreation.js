import React, { Component } from 'react';
import styled from 'styled-components';


export default class RoadmapCreation extends React.Component {
    constructor(props) {
        super(props);
        this.roadMapName = "";
        this.roadMapDescription = "";
        this.milestones = [{
            name : "",
            tip: "",
            milestoneId: null,

        }];
        this.tags = [];
        this.state = {
            numMilestones: 1,
        }
        this.handleAddMilestone = this.handleAddMilestone.bind(this);
        this.handleCreateRoadmap = this.handleCreateRoadmap.bind(this);
    }

    handleAddMilestone(e) {
        e.preventDefault();
        this.milestones.push({
            name : "",
            tip: "",
            milestoneId: null,
        });
        this.setState({numMilestones: this.state.numMilestones + 1});
    }

    handleCreateRoadmap(e) {
        console.log(JSON.stringify({
                name: this.roadMapName,
                tags: this.tags,
                description: this.roadMapDescription,
                milestones: this.milestones
            }))
        e.preventDefault();
        fetch("/api/roadmap/create", {
            method: "POST",
            header: {
                'Accept': 'application/json',
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: this.roadMapName,
                tags: this.tags,
                description: this.roadMapDescription,
                milestones: this.milestones
            })
        })
        .then(r => r.json())
        .then(r => alert(JSON.stringify(r)))
        .catch(e => console.error(e))
    }


    render() {
        let mileStonesDivs = [];
        for(let i = 0; i < this.state.numMilestones; ++i) {
            mileStonesDivs.push(
                <div key={i}>
                    <h4>Milestone number {i+1}</h4>
                    <div  className="form-group">
                        <label>Milestone's name</label>
                        <input type="text" className="form-control"  onChange={(e) => {
                            this.milestones[i].name = e.target.value
                        }}/>
                    </div>
                    <div className="form-group">
                        <label>Existing milestones Id (contribute to a published milestone):</label>
                        <input type="text" className="form-control"  onChange={(e) => {
                            this.milestones[i].milestonesId = e.target.value;
                            this.milestones[i].milestonesId = this.milestones[i].milestonesId === "" ? null : this.milestones[i].milestonesId;
                        }}/>
                    </div>
                    <div className="form-group">
                        <label>Guide</label>
                        <input type="text" className="form-control" onChange={(e) => {
                            this.milestones[i].tip = e.target.value
                        }}/>
                    </div>
                </div>
            )
        }
        return (
            <div className="container">
                <form>
                    <div className="form-group">
                        <label>Roadmap's name</label>
                        <input type="text" className="form-control" onChange={(e) => {this.roadMapName = e.target.value}}/>
                    </div>
                    <div className="form-group">
                        <label>Roadmap's description</label>
                        <input type="text" className="form-control" onChange={(e) => {this.roadMapDescription = e.target.value}}/>
                    </div>
                    <div className="form-group">
                        <label>Tags</label>
                        <input type="text" className="form-control" onChange={(e) => {this.tags = e.target.value.replace(" ","").split(",")}}/>
                    </div>
                    {mileStonesDivs}
                    <button type="button" className="btn btn-primary" style={{margin: "5px"}} onClick={this.handleAddMilestone}>Add milestone</button>
                    <button type="button" className="btn btn-primary" style={{margin: "5px"}} onClick={this.handleCreateRoadmap}>Create Roadmap</button>

                </form>
            </div>
        )
    }
}