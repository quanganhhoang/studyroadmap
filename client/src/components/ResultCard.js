import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Badge from '@material-ui/core/Badge';
import Typography from '@material-ui/core/Typography';

import IconButton from '@material-ui/core/IconButton';
import MailIcon from '@material-ui/icons/Mail'
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import { Redirect } from 'react-router-dom';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    paddingBottom: 20,
    paddingRight: 20,
    paddingLeft: 20,
    marginTop: 20,
  },
  feedback: {
    fontSize: 16,
    fontWeight: 'normal',
  },
  cardContent: {
    display: 'flex',
  },
  vote: {
    display: 'block',
    width: 40,
    height: 40,
    borderRadius: 1,
  },
  badge: {
    color: 'black',
    fontWeight: 'bold',
    backgroundColor: 'yellow',
  }
})

/**
 * This is a component for displaying compact roadmap posts on a dashboard
 * https://whimsical.com/Df3wo7iobETNE78LHeiJTK
 * 
 * Child components:
 * 
 */
class ResultCard extends Component {
  constructor(props) {
    super(props);
    this.state ={
      redirect: false,
      target: ""
    }
  }

  render() {
    if(this.state.redirect) {
      return <Redirect push to={this.state.target} />;
    }
    const { classes } = this.props;

    let title = this.props.title || 'this is the title'
    let description = this.props.description || 'this is the description'
    let numComments = this.props.numComments || 100

    return (
      <div>
        <Card className={classes.root}>
          <CardActionArea onClick={() => {this.setState({redirect:true, target: "/roadmap/"+this.props.roadmapId})}}>
            <CardContent className={classes.cardContent}>
              <div className="row" style={{width: "100%"}}>
                <div className="col-lg-9">
                  <Typography gutterBottom variant="h5" component="h2">
                    {title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" component="p">
                    Published by author_name {Math.floor(Math.random() * Math.floor(5)) + 1} weeks ago <br />
                    Tags: {this.props.tags.join(", ")}
                  </Typography>
                </div>
                <div className="col-sm-3" style={{textAlign:"right"}}>
                  <IconButton aria-label="upvote">
                    <KeyboardArrowUpIcon />
                  </IconButton>
                  {this.props.votes}
                  <IconButton aria-label="downvote">
                    <KeyboardArrowDownIcon />
                  </IconButton>
                </div>
              </div>
            </CardContent>
          </CardActionArea>
          <CardActions>
            <nav className={classes.feedback}>{numComments} comments </nav>
            <IconButton aria-label="add to favorites">
                <FavoriteIcon />
            </IconButton>
            <IconButton aria-label="share">
              <ShareIcon />
            </IconButton>
            <span style={{color:"#00FF00"}}>{Math.round(this.props.matchPercentage*100) / 100}% Match</span>
          </CardActions>
        </Card>
      </div>
  
    );
  }
}

export default withStyles(styles)(ResultCard);