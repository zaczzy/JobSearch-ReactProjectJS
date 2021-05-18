import React, { Component } from 'react'
import styled from 'styled-components'
import IconButton from '@material-ui/core/IconButton';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import CommentIcon from '@material-ui/icons/Comment';
import EditPostModal from './EditPostModal';
import { DropdownButton, Dropdown, Modal, Button } from 'react-bootstrap';
import {likePost, fetchHidePost, deletePost} from '../../modules/post';

import host from '../../host-config';

const PostWrapper = styled.div`
    display: flex;
    flex-direction: column
`

const PostBody = styled.div`
    padding: 10px;
    align-items: flex-start;
    .avatar {
        border-radius: 50%;
        max-height: 75px;
        max-width: 75px;
        margin-right: 10px
    }
    display: flex;
    flex-direction: row;

    .media {
        display: flex;
        flex-direction:column;
        width: 100%;
        .textgroup {
            display: flex;
            width: 100%;
            flex-direction: column;
            text-align: left;
            .userinfo {
                display: flex;
                flex-direction: row;
                div {
                    margin-left: 5px;
                }
            }
            .content {
                margin-left: 5px;
            }
        }
        .post-image {
            // The image cannot get taller than this
            max-height: 1000px;
            max-width: 100%;
        }
    }
`
const PostAction = styled.div`
    height: 80px;
    width: 60%;
    margin-left: 95px;
    margin-bottom: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    div {
        font-size: large;
    }
    .flex-item {
        margin-left: 15px
    }
    #editbtn {
        margin-left: 40px
    }
`

export default class Post extends Component {
    constructor(props) {
        super(props);
        this.state = { modalOpen: false, likeCount: this.props.data.likeCount };
    }
    handleClick = () => {
        this.props.setSelectedPost(this.props.data._id);
    };
    clickLike = async () => {
        const res = await likePost(this.props.data._id, true);
    }
    handleSelect = (eventKey) => {
        if (eventKey === "edit") {
            this.setState({ modalOpen: true });
        } else {
            console.log(this.props.data._id)
            deletePost(this.props.data._id.toString());
            this.props.localRemovePost(this.props.data._id);
        }
    }
    hidePost = () => {
      console.log('Hide currId', this.props.currId)
      fetchHidePost(this.props.currId, this.props.data._id.toString())
      .then(res => {
        console.log('hide res', res)
      })
    }
    render() {
        return (
            <PostWrapper id={`post-${this.props.data._id}`}>
                <PostBody>
                    <img className='avatar' src={this.props.data.uid.profilePic ? host + this.props.data.uid.profilePic: 'https://via.placeholder.com/75x75'}/>
                    <div className='media'>
                        <div className='textgroup'>
                            <div className='userinfo'>
                                <div><b>{this.props.data.uid.displayName}</b></div>
                                <div>@{this.props.data.uid.handle}</div>
                            </div>
                            <div className='content'>{this.props.data.content}</div>
                        </div>
                        {/* Posts display just the first image */}
                        {this.props.data.imgs.length > 0 &&  <img className='post-image' src={host + this.props.data.imgs[0]} style={{maxWidth: "700px", maxHeight: "500px"}} />} {/* Right now only just the first image*/}
                    </div>
                </PostBody>
                <PostAction>
                    <IconButton className="flex-item" color="primary" aria-label="Like Post" onClick={this.clickLike}>
                        <ThumbUpIcon color="primary" fontSize="large" />
                    </IconButton>
                    <div className="flex-item"> {this.props.data.likeCount} </div>
                    {this.props.setSelectedPost ? <IconButton className="flex-item" color="primary" aria-label="Add Comment" onClick={this.handleClick}>
                        <CommentIcon color="primary" fontSize="large" />
                    </IconButton> : <CommentIcon className="flex-item" color="primary" fontSize="large" />}
                    <div className="flex-item"> {this.props.data.comments.length} </div>
                    <Button className="m-2" onClick={this.hidePost}>Hide</Button>
                    {this.props.data.uid._id === this.props.currId && <DropdownButton className="flex-item" id="editbtn" title="Edit" color="primary" onSelect={this.handleSelect}>
                        <Dropdown.Item eventKey="edit">Edit</Dropdown.Item>
                        <Dropdown.Item eventKey="del">Delete</Dropdown.Item>
                    </DropdownButton>}
                </PostAction>
                <Modal show={this.state.modalOpen} onHide={() => this.setState({ modalOpen: false })}>
                    <EditPostModal closeModal={() => this.setState({ modalOpen: false })} />
                </Modal>
            </PostWrapper>

        )
    }
}
