import React, { Component } from "react";
import "./Home.css";
import Header from "../../common/header/Header";
import Container from "@material-ui/core/Container";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Avatar from "@material-ui/core/Avatar";
import Favorite from "@material-ui/icons/Favorite";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import * as moment from "moment";

import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import Divider from "@material-ui/core/Divider";

//Home Component render on '/home'
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profile_picture: "",
      username: "",
      media: 0,
      follows: 0,
      followed_by: 0,
      full_name: "",
      access_token: sessionStorage.getItem("access-token"),
      userPostsDetails: null,
      filterPostsDetails: null,
      addNewComment: [],
      addNewCommentCheck: ""
    };
  }

  //Component Will execute on Load
  componentWillMount() {
    this.getDetails();
  }
  //
  getDetails = () => {
    // Get user profile
    let dataUserProfile = null;
    let xhrUserProfile = new XMLHttpRequest();
    let that = this;
    xhrUserProfile.addEventListener("readystatechange", function() {
      if (this.readyState === 4) {
        const data = JSON.parse(this.responseText).data;
        that.setState({
          profile_picture: data.profile_picture,
          username: data.username,
          media: data.counts.media,
          follows: data.counts.follows,
          followed_by: data.counts.followed_by,
          full_name: data.full_name
        });
      }
    });
    xhrUserProfile.open(
      "GET",
      this.props.baseUrl + "users/self/?access_token=" + this.state.access_token
    );
    //xhrUserProfile.setRequestHeader("Cache-Control", "no-cache");
    xhrUserProfile.send(dataUserProfile);

    // Get user posts
    let dataUserPosts = null;
    let xhrUserPosts = new XMLHttpRequest();
    xhrUserPosts.addEventListener("readystatechange", function() {
      if (this.readyState === 4) {
        const data = JSON.parse(this.responseText).data;
        that.setState({
          userPostsDetails: [...data],
          filterPostsDetails: [...data]
        });
      }
    });
    xhrUserPosts.open(
      "GET",
      this.props.baseUrl +
        "users/self/media/recent?access_token=" +
        this.state.access_token
    );
    //xhrUserPosts.setRequestHeader("Cache-Control", "no-cache");
    xhrUserPosts.send(dataUserPosts);
  };

  //OnLikes Clicked
  onLikesClick = (_id, _index) => {
    let _userPostsDetails = JSON.parse(
      JSON.stringify(this.state.userPostsDetails)
    );
    let _filteredPosts = JSON.parse(
      JSON.stringify(this.state.filterPostsDetails)
    );

    if (_userPostsDetails !== null && _userPostsDetails.length > 0) {
      // Updating main array
      let _updatedPosts = _userPostsDetails.map((post, index) => {
        if (post.id === _id) {
          if (post.user_has_liked) {
            post.upostser_has_liked = false;
            post.likes.count = post.likes.count - 1;
          } else {
            post.user_has_liked = true;
            post.likes.count = post.likes.count + 1;
          }
        }
        return post;
      });

      // Updating filtered array
      if (_filteredPosts !== null && _filteredPosts.length > 0) {
        if (_filteredPosts[_index].user_has_liked) {
          _filteredPosts[_index].user_has_liked = false;
          _filteredPosts[_index].likes.count =
            _filteredPosts[_index].likes.count + 1;
        } else {
          _filteredPosts[_index].user_has_liked = true;
          _filteredPosts[_index].likes.count =
            _filteredPosts[_index].likes.count - 1;
        }
      }

      // setting updated arrays to state
      this.setState({
        userPostsDetails: [..._updatedPosts],
        filterPostsDetails: [..._filteredPosts]
      });
    }
  };

  //OnClick Search Filter Caption
  onSearchClick = e => {
    const _searchText = e.target.value.toLowerCase();
    let _userPostsDetails = JSON.parse(
      JSON.stringify(this.state.userPostsDetails)
    );
    let _filteredPosts = [];
    if (_userPostsDetails !== null && _userPostsDetails.length > 0) {
      _filteredPosts = _userPostsDetails.filter(
        post =>
          post.caption.text
            .split("\n")[0]
            .toLowerCase()
            .indexOf(_searchText) > -1
      );
      this.setState({
        filterPostsDetails: [..._filteredPosts]
      });
    }
  };

  //Format Data
  getPeriod = _milliseconds => {
    return moment(new Date(parseInt(_milliseconds))).format(
      "DD/MM/YY HH:mm:ss"
    );
  };

  //On Comment Text Field Change
  inputAddCommentChangeHandler = (i, event) => {
    let addNewComment = [...this.state.addNewComment];
    addNewComment[i] = event.target.value;
    this.setState({ addNewComment });
    //   this.setState({ addNewComment: event.target.value });
    //  if(_index==0){
    //   this.setState({ addNewComment: event.target.value });sss
    //  }

    // let _userPostsDetails = JSON.parse(
    //   JSON.stringify(this.state.userPostsDetails)
    // );

    // _userPostsDetails.map((post, index) => {
    //   if (post.id === _id) {

    //     this.setState({ addNewComment: event.target.value });
    //   }

    // });
  };

  //OnClick Add Comment
  addCommentClickHandler = (_id, _index) => {
    let _userPostsDetails = JSON.parse(
      JSON.stringify(this.state.userPostsDetails)
    );
    let _filteredPosts = JSON.parse(
      JSON.stringify(this.state.filterPostsDetails)
    );

    if (this.state.addNewComment === "") {
      return;
    } else {
      if (_userPostsDetails !== null && _userPostsDetails.length > 0) {
        let _updatedPosts = _userPostsDetails.map((post, index) => {
          if (post.id === _id) {
            post.comments["data"] = post.comments["data"] || [];
            post.comments["data"].push({
              id: post.comments["data"].length + 1,
              comment_by: this.state.username,
              comment_value: this.state.addNewComment
            });
          }
          return post;
        });
        if (_filteredPosts !== null && _filteredPosts.length > 0) {
          _filteredPosts[_index].comments["data"] =
            _filteredPosts[_index].comments["data"] || [];
          _filteredPosts[_index].comments["data"].push({
            id: _filteredPosts[_index].comments["data"].length + 1,
            comment_by: this.state.username,
            comment_value: this.state.addNewComment
          });
        }

        // setting updated arrays to state
        this.setState({
          userPostsDetails: [..._updatedPosts],
          filterPostsDetails: [..._filteredPosts],
          addNewComment: ""
        });
        // let _userPosts = this.state.userPosts;
        // const _selectedIndex = this.state.selectedIndex;
        // _userPosts[_selectedIndex] = _selectedPostItem;

        // this.setState({
        //     selectedPost: _selectedPostItem,
        //     userPosts: _userPosts,
        //     addNewComment: ''
        // });
      }
    }
  };

  render() {
    return (
      <div>
        <Header
          profileIcon={true}
          profilePicture={this.state.profile_picture}
          profileUserName={this.state.username}
          searchChangeHandler={this.onSearchClick}
        />
        <Container fixed style={{ margin: 16 }}>
          <Grid container spacing={2}>
            {(this.state.filterPostsDetails || []).map((post, index) => (
              <Grid item xs={12} sm={6} key={post.id}>
                <Card className="post-item" key={post.id}>
                  <CardHeader
                    avatar={
                      <Avatar
                        aria-label="Recipe"
                        className="classes.avatar"
                        alt={post.user.username}
                        src={post.user.profile_picture}
                      />
                    }
                    title={post.user.username}
                    subheader={this.getPeriod(post.created_time)}
                    // subheader={post.created_time.toLocaleDateString()}
                  />
                  <CardMedia
                    className="classes.media"
                    image={post.images.low_resolution.url}
                    title={post.caption.text.split("\n")[0]}
                    style={{ height: 320, width: "100%" }}
                  />
                  <br />
                  <Divider />
                  <CardContent>
                    <Grid
                      container
                      spacing={3}
                      justify="flex-start"
                      alignItems="center"
                    >
                      <Grid item>
                        <Typography variant="caption">
                          {post.caption.text.split("\n")[0]}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid
                      container
                      spacing={3}
                      justify="flex-start"
                      alignItems="center"
                    >
                      <Grid item>
                        {(post.tags || []).map((tag, i) => {
                          return (
                            <Typography
                              key={i}
                              variant="caption"
                              color="primary"
                            >
                              {" "}
                              #{tag}
                            </Typography>
                          );
                        })}
                      </Grid>
                    </Grid>
                  </CardContent>
                  <CardActions disableSpacing>
                    <Grid
                      container
                      spacing={1}
                      justify="flex-start"
                      alignItems="center"
                    >
                      <Grid item>
                        <Favorite
                          className={
                            post.user_has_liked ? "greyLike" : "redLike"
                          }
                          onClick={this.onLikesClick.bind(this, post.id, index)}
                        />
                      </Grid>
                      <Grid item>
                        <Typography variant="caption">
                          {post.likes.count} likes
                        </Typography>
                      </Grid>

                      <Grid
                        container
                        spacing={1}
                        justify="flex-start"
                        alignItems="center"
                      >
                        <Grid item className="comments-min-height">
                          {(post.comments.data || []).map((comment, i) => {
                            return (
                              <Typography
                                key={comment.id}
                                variant="caption"
                                display="block"
                              >
                                <strong>{comment.comment_by} :</strong>{" "}
                                {comment.comment_value}
                              </Typography>
                            );
                          })}
                        </Grid>
                      </Grid>
                      <Grid
                        container
                        justify="flex-start"
                        style={{ width: "100%" }}
                      >
                        <Grid style={{ width: "85%" }} item>
                          <FormControl className="formControl">
                            <InputLabel htmlFor="addcomment">
                              Add a comment{" "}
                            </InputLabel>

                            <Input
                              key={index}
                              id="addcomment"
                              type="text"
                              //onChange={this.handleChange.bind(this, post.id)}
                              onChange={this.inputAddCommentChangeHandler.bind(
                                this,
                                index
                              )}
                              // onChange={(e) => {this.inputAddCommentChangeHandler(e,post.id,index)}}
                              value={this.state.addNewComment || ""}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={this.addCommentClickHandler.bind(
                              this,
                              post.id,
                              index
                            )}
                          >
                            ADD
                          </Button>
                        </Grid>
                      </Grid>
                    </Grid>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </div>
    );
  }
}

export default Home;
