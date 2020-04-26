
import React from "react";



export default class UserProfileCard extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <div className="card hovercard">
                            <div className="cardheader">

                            </div>
                            <div className="avatar">
                                <img alt="" src="https://www.pinclipart.com/picdir/middle/157-1578186_user-profile-default-image-png-clipart.png" />
                            </div>
                            <div className="info">
                                <div className="title">
                                    <a target="_blank" href="https://scripteden.com/">Duhocsinhmy</a>
                                </div>
                                <div className="desc">Former Admission Officer</div>
                                <div className="desc">Havard Student</div>
                                <div className="desc">Tech geek</div>
                            </div>
                            <div className="bottom" style={{marginLeft: "auto", marginRight: "auto"}}>

                                    <a className="col-lg-1" href="#">
                                       <i class='fas fa-user-graduate'></i>  Mentorship (5 <i class="fas fa-star"></i>)
                                    </a> <br />
                                    <a  className="col-lg-2" href="#">
                                        <i class="fas fa-comment"></i>  Message
                                    </a>
                            </div>
                        </div>
            </div>
        )
    }
}