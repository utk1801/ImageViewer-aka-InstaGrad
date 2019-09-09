import React, { Component } from "react";
import "./Profile.css";
import Header from "../../common/header/Header";
import Avatar from "@material-ui/core/Avatar";
import { withStyles } from "@material-ui/styles";
import Typography from "@material-ui/core/Typography";
import Fab from "@material-ui/core/Fab";
import Create from "@material-ui/icons/Create";
import Favorite from "@material-ui/icons/Favorite";
import Modal from "@material-ui/core/Modal";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import FormHelperText from "@material-ui/core/FormHelperText";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import Container from "@material-ui/core/Container";

const styles = theme => ({
  bigAvatar: {
    margin: 10,
    width: 50,
    height: 50
  },
  paper_big: {
    position: "absolute",
    width: 600,
    backgroundColor: "white",
    padding: 16,
    outline: "none",
    top: `50%`,
    left: `50%`,
    transform: `translate(-50%, -50%)`
  },
  fab: {
    margin: 8
  },
  paper: {
    position: "absolute",
    width: 250,
    backgroundColor: "white",
    padding: 16,
    outline: "none",
    top: `50%`,
    left: `50%`,
    transform: `translate(-50%, -50%)`
  }
});

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profile_picture: "",
      username: "",
      media: 0,
      follows: 0,
      followed_by: 0,
      full_name: "",
      userPosts: null,
      access_token: sessionStorage.getItem("access-token"),
      editNameOpen: false,
      fullnameRequired: "dispNone",
      postSelected: null,
      selectedIndex: -1,
      newComment: "",
      updateFullName: "",
      postOpen: false
    };
  }

  //On component load - Get user profile data
  componentWillMount() {
    this.getProfileDetails();
  }

  getProfileDetails = () => {
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
    // xhrUserProfile.setRequestHeader("Cache-Control", "no-cache");
    xhrUserProfile.send(dataUserProfile);

    // Get user posts
    let dataUserPosts = null;
    let xhrUserPosts = new XMLHttpRequest();
    xhrUserPosts.addEventListener("readystatechange", function() {
      if (this.readyState === 4) {
        const data = JSON.parse(this.responseText).data;
        that.setState({ userPosts: [...data] });
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
  //To close edit modal
  onEditFullNameModalClose = () => {
    this.setState({
      editNameOpen: false,
      fullnameRequired: "dispNone"
    });
  };

  //To open edit modal
  onEditFullNameModalOpen = () => {
    this.setState({
      updateFullName: this.state.full_name,
      editNameOpen: true
    });
  };

  //update  full name in modal
  onUpdateNameClick = () => {
    this.state.updateFullName === ""
      ? this.setState({ fullnameRequired: "dispBlock" })
      : this.setState({ fullnameRequired: "dispNone" });
    if (this.state.updateFullName === "") {
      return;
    } else {
      this.setState({ full_name: this.state.updateFullName });
    }
    this.setState({
      editNameOpen: false
    });
  };

  //onChange() called for  full name
  onFullNameChange = e => {
    this.setState({ updateFullName: e.target.value });
  };

  //onClick() method each post image  open modal with details
  onhandlePostClick = (_id, _index) => {
    let _userPostItems = this.state.userPosts;
    this.setState({
      postSelected: _userPostItems[_index],
      selectedIndex: _index,
      postOpen: true,
      newComment: ""
    });
  };

  //Close  each post image Modal
  onPostItemModalClose = () => {
    this.setState({
      postSelected: null,
      postOpen: false,
      selectedIndex: -1
    });
  };

  // like functionality
  onLikesClick = () => {
    let _postSelectedItem = this.state.postSelected;
    let _userPosts = this.state.userPosts;
    const _selectedIndex = this.state.selectedIndex;
    if (_postSelectedItem.user_has_liked) {
      _postSelectedItem.user_has_liked = false;
      _postSelectedItem.likes.count = _postSelectedItem.likes.count + 1;
    } else {
      _postSelectedItem.user_has_liked = true;
      _postSelectedItem.likes.count = _postSelectedItem.likes.count - 1;
    }

    _userPosts[_selectedIndex] = _postSelectedItem;

    this.setState({
      postSelected: _postSelectedItem,
      userPosts: _userPosts
    });
  };

  //onChange() Method for comment input field
  onAddCommentChange = e => {
    this.setState({ newComment: e.target.value });
  };

  //onClick() add comments
  onAddCommentClick = () => {
    if (this.state.newComment === "") {
      return;
    } else {
      let _postSelectedItem = this.state.postSelected;
      _postSelectedItem.comments["data"] =
        _postSelectedItem.comments["data"] || [];
      _postSelectedItem.comments["data"].push({
        id: _postSelectedItem.comments["data"].length + 1,
        comment_by: this.state.username,
        comment_value: this.state.newComment
      });

      let _userPosts = this.state.userPosts;
      const _selectedIndex = this.state.selectedIndex;
      _userPosts[_selectedIndex] = _postSelectedItem;

      this.setState({
        postSelected: _postSelectedItem,
        userPosts: _userPosts,
        newComment: "",
       
      });
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Header
          profileIcon={true}
          profilePicture={this.state.profile_picture}
          profileUserName={this.state.username}
        />
        <Container fixed>
          <Grid
            container
            spacing={3}
            style={{ justifyContent: "center" }}
            alignItems="center"
          >
            <Grid item>
              <Avatar
                alt={this.state.username}
                src={this.state.profile_picture}
                className={classes.bigAvatar}
              />
            </Grid>
            <Grid item>
              <Typography variant="h6" component="h6">
                {this.state.username}
              </Typography>
              <Grid
                container
                spacing={3}
                justify="space-between"
                alignItems="center"
              >
                <Grid item>
                  <Typography variant="subtitle2">
                    Posts: {this.state.media}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="subtitle2">
                    Follows: {this.state.follows}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="subtitle2">
                    Followed By: {this.state.followed_by}
                  </Typography>
                </Grid>
              </Grid>
              <Grid
                container
                spacing={2}
                justify="flex-start"
                alignItems="center"
              >
                <Grid item>
                  <Typography variant="h6">{this.state.full_name}</Typography>
                </Grid>
                <Grid item>
                  <Fab
                    color="secondary"
                    aria-label="Edit"
                    className={classes.fab}
                    onClick={this.onEditFullNameModalOpen}
                  >
                    <Create />
                  </Fab>
                  <Modal
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                    open={this.state.editNameOpen}
                    onClose={this.onEditFullNameModalClose}
                  >
                    <div className={classes.paper}>
                      <Typography
                        variant="h6"
                        id="modal-title"
                        className="modal-heading"
                      >
                        Edit
                      </Typography>
                      <FormControl required className="formControl">
                        <InputLabel htmlFor="username">Full Name </InputLabel>
                        <Input
                          id="userfullname"
                          type="text"
                          onChange={this.onFullNameChange}
                          value={this.state.updateFullName}
                        />
                        <FormHelperText className={this.state.fullnameRequired}>
                          <span className="red">Required</span>
                        </FormHelperText>
                      </FormControl>
                      <br />
                      <br />
                      <Button
                        variant="contained"
                        color="primary"
                        style={{ width: 10 }}
                        onClick={this.onUpdateNameClick}
                      >
                        UPDATE
                      </Button>
                    </div>
                  </Modal>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <GridList cellHeight={320} cols={3}>
            {(this.state.userPosts || []).map((post, index) => (
              <GridListTile
                key={post.id}
                className="grid-content"
                onClick={() => this.onhandlePostClick(post.id, index)}
              >
                <img
                  src={post.images.low_resolution.url}
                  alt={post.caption.text}
                />
              </GridListTile>
            ))}
          </GridList>
          {this.state.postSelected !== null ? (
            <Modal
              aria-labelledby="simple-modal-title"
              aria-describedby="simple-modal-description"
              open={this.state.postOpen}
              onClose={this.onPostItemModalClose}
            >
              <div className={classes.paper_big}>
                <Grid container spacing={3}>
                  <Grid item xs={6}>
                    <img
                      src={
                        this.state.postSelected.images.standard_resolution.url
                      }
                      width="100%"
                      alt={this.state.postSelected.caption.text.split("\n")[0]}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Grid
                      container
                      spacing={3}
                      justify="flex-start"
                      alignItems="center"
                    >
                      <Grid item>
                        <Avatar
                          src={this.state.postSelected.user.profile_picture}
                          alt={this.state.postSelected.user.username}
                        />
                      </Grid>
                      <Grid item>
                        <Typography variant="subtitle2">
                          {this.state.postSelected.user.username}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Divider light />
                    <Grid
                      container
                      spacing={3}
                      justify="flex-start"
                      alignItems="center"
                    >
                      <Grid item>
                        <Typography variant="caption">
                          {this.state.postSelected.caption.text.split("\n")[0]}
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
                        {(this.state.postSelected.tags || []).map((tag, i) => {
                          return (
                            <Typography
                              key={tag}
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

                    <Grid
                      container
                      spacing={1}
                      justify="flex-start"
                      alignItems="center"
                    >
                      <Grid item className="min-height-comments-box">
                        {(this.state.postSelected.comments.data || []).map(
                          (comment, i) => {
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
                          }
                        )}
                      </Grid>
                    </Grid>

                    <Grid
                      container
                      spacing={1}
                      justify="flex-start"
                      alignItems="center"
                    >
                      <Grid item>
                        <Favorite
                          className={
                            this.state.postSelected.user_has_liked
                              ? "greyLike"
                              : "redLike"
                          }
                          onClick={this.onLikesClick}
                        />
                      </Grid>
                      <Grid item>
                        <Typography variant="caption">
                          {this.state.postSelected.likes.count} likes
                        </Typography>
                      </Grid>
                    </Grid>

                    <Grid
                      container
                      spacing={2}
                      justify="flex-start"
                      alignItems="center"
                    >
                      <Grid item>
                        <FormControl className="formControl">
                          <InputLabel htmlFor="addcomment">
                            Add a comment{" "}
                          </InputLabel>
                          <Input
                            id="addcomment"
                            type="text"
                            onChange={this.onAddCommentChange}
                            value={this.state.newComment}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={this.onAddCommentClick}
                        >
                          ADD
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </div>
            </Modal>
          ) : (
            ""
          )}
        </Container>
      </div>
    );
  }
}

export default withStyles(styles)(Profile);
