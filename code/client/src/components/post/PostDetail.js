import React, { Component, useEffect, useRef, useState } from 'react';
import { Button } from 'react-bootstrap';
import styled from 'styled-components';
import CommentInput from './CommentInput';
import Comment from './Comment';
import host from '../../host-config';
import {fetchOnePost} from '../../modules/post';
import {fetchUserProfile} from '../../modules/user';

const postPercentage = 65;
const Container = styled.div`
        height: 100%;
        display: flex;
        flex-direction: row;
        border: 1px solid grey;
        .leftpanel {
            overflow: scroll;
            height: 100%;
            width: ${postPercentage}%;
            min-width: 800px;
            border-right: 1px solid grey;
            display: flex;
            flex-direction: column;
        }
        .rightpanel {
            overflow: scroll;
            height: 100%;
            width: ${100 - postPercentage}%;
            min-width: 200px;
            background-color: grey
        }
        Button {
        }
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
export default function PostDetail(props) {
    const [currUser, setCurrUser] = useState(null);
    const [myPost, setMyPosts] = useState(null);
    const [comments, setComments] = useState([]);

    useEffect(()=>{
        async function fetchData() {
            const mainPost = await fetchOnePost(props.selectedPost);
            const comments = mainPost.comments;
            setComments(comments);
            delete mainPost.comments;
            setMyPosts(mainPost);
            const me = await fetchUserProfile(props.currId);
            setCurrUser(me);
        }
        fetchData();
    }, []);

    const localRemoveComment = (id) => {
        setComments(prevComments => 
            prevComments.filter(p=> p._id != id));
    }
    const handleClick = () => {
        props.setSelectedPost(null);
    };

    const refreshPage = async () => {
        const mainPost = await fetchOnePost(props.selectedPost);
        const comments = mainPost.comments;
        setComments(comments);
    };

    return (
        <Container>
            <div className="leftpanel">
                <Button variant="primary" onClick={handleClick}> Back</Button>
                {/* Post body */}
                {myPost && <PostBody>
                    <img className='avatar' src={myPost.uid.profilePic? host + myPost.uid.profilePic : 'https://via.placeholder.com/75x75'} />
                    <div className='media'>
                        <div className='textgroup'>
                            <div className='userinfo'>
                                <div><b>{myPost.uid.displayName}</b></div>
                                <div>@{myPost.uid.handle}</div>
                            </div>
                            <div className='content'>{myPost.content}</div>
                        </div>
                        {/* Display all images*/}
                        {myPost.imgs.map((img)=> {
                            return (<img className='post-image' src={host + img} style={{maxHeight: "500px", maxWidth: "700px"}}/>);
                        })} 
                    </div>
                </PostBody>}
                <div style={{ flexGrow: 2 }} />
                {currUser && <CommentInput pid={myPost._id} refreshPage={refreshPage} currUser={currUser}/>}
            </div>
            <div className="rightpanel">
                {comments.map((data) => {
                    return (
                        <Comment key={data._id} idx={data._id} data={data} localRemoveComment={localRemoveComment} currId={props.currId} refreshPage={refreshPage}/>
                    );
                })}
            </div>
        </Container>
    );
    
}