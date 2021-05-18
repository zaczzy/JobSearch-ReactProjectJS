import React, { useState, useEffect, useRef } from 'react';
import ImageIcon from '@material-ui/icons/Image';
import IconButton from '@material-ui/core/IconButton';
import VideoLibraryIcon from '@material-ui/icons/VideoLibrary';
import AudiotrackIcon from '@material-ui/icons/Audiotrack';
import GifIcon from '@material-ui/icons/Gif';
import { Avatar } from '@material-ui/core';
import { Button } from 'react-bootstrap';
import Post from './Post'
import FileUpload from './FileUpload';
import { createPost, fetchFollowedPostsPage } from '../../modules/post';
import { fetchUserAvatar } from '../../modules/user';

import host from '../../host-config';

export default function PostFeed(props) {

    const [posts, setPosts] = useState([]);
    const [upload, setUpload] = useState(false);
    const [type, setType] = useState(0);
    const [appendImgs, setAppendImgs] = useState([]);
    const [currAvatar, setCurrAvatar] = useState(null);
    const [pageNum, setPageNum] = useState(1);
    const intervalRef = useRef();
    const pageNumRef = useRef();

    useEffect(async () => {
        const posts = await fetchFollowedPostsPage(props.currId, pageNum);
        setPosts(posts);
        const avatar = await fetchUserAvatar();
        setCurrAvatar(avatar);
        // live update
        intervalRef.current = setInterval(() => getUpdatedposts(), 4000);
        return () => {
            clearInterval(intervalRef.current);
        };
    }, [props.currId]);
    // update posts on page switch
    useEffect(async () => {
      clearInterval(intervalRef.current);
      const posts = await fetchFollowedPostsPage(props.currId, pageNum);
      setPosts(posts);
      // intervalRef.current = setInterval(() => getUpdatedposts(), 4000);
    }, [pageNum])

    function getUpdatedposts() {
        // fetchFollowedPosts(props.currId)
        fetchFollowedPostsPage(props.currId, pageNum)
            .then(posts => {

                setPosts(posts);
            })
    }
    const submitPost = async () => {
        // prepare post data
        const content = document.getElementById('postContent');
        const hashtags = content.value.match(/#\w+/g);
        const mentions = content.value.match(/@\w+/g);
        // hashtag, mention processing
        const body = {
            content: content.value,
            imgs: appendImgs,
            audios: [],
            tags: hashtags,
            mentions: mentions
        }
        const postId = await createPost(body);
        console.log(postId);
        // clear post data
        if (appendImgs.length > 0) setAppendImgs([]);
        content.value = "";
    }
    const localRemovePost = (id) => {
        setPosts(prevPosts =>
            prevPosts.filter(p => p._id !== id)
        );
    }
    function validateForm() {
        const content = document.getElementById('postContent');
        if (content === null){
            return true;
        }
        else {
            return content.value.length < 400;
        }
    }

    return (
        <div className='d-flex flex-row justify-content-between' style={{ height: '100%' }}>
            <div />
            <div className="border-left border-right" style={{ width: '60vw' }}>
                {/* Make Post */}
                <div className='p-2 d-flex flex-column border-top border-bottom'>
                    <div className='border-bottom d-flex flex-row justify-content-between align-items-center' style={{ height: '100%', paddingBottom: '10px' }}>
                        <Avatar alt="My avatar" src={currAvatar ? host + currAvatar : 'https://via.placeholder.com/100x100'} style={{ height: '100px', width: '100px' }} />
                        <textarea id="postContent" style={{ width: '80%', height: '100px' }} placeholder="Write a Post! Limit of 400 characters." />
                    </div>
                    <div className='d-flex flex-row  align-items-center' style={{ height: '40%', paddingTop: '10px' }}>
                        <div className='d-flex flex-row justify-content-start'>
                            <IconButton color="primary" aria-label="Add image" onClick={() => {
                                setUpload(true);
                                setType(0);
                            }}>
                                <ImageIcon color="primary" fontSize="large" />
                            </IconButton>

                            <IconButton color="primary" aria-label="Add GIF" onClick={() => {
                                setUpload(true);
                                setType(1);
                            }}>
                                <GifIcon color="primary" fontSize="large" />
                            </IconButton>
                            <IconButton color="primary" aria-label="Add Video" onClick={() => {
                                setUpload(true);
                                setType(2);
                            }}>
                                <VideoLibraryIcon color="primary" fontSize="large" />
                            </IconButton>
                            <IconButton color="primary" aria-label="Add Audio Track" onClick={() => {
                                setUpload(true);
                                setType(3);
                            }}>
                                <AudiotrackIcon color="primary" fontSize="large" />
                            </IconButton>
                        </div>
                        <div style={{ flexGrow: 2 }}></div>
                        <Button variant="primary" style={{ width: '100px' }} onClick={submitPost} disabled={!validateForm()}>Post</Button>
                    </div>
                    {/* Preview section */}
                    <div>{appendImgs.map(img => {
                        return (<img src={host + img} style={{ maxWidth: '150px', maxHeight: '120px' }} />);
                    })}</div>
                    {/* File upload */}
                    {upload && <FileUpload setAppendImgs={setAppendImgs} type={type} />}
                </div>
                {/* Followed posts */}
                <div>
                    {
                        posts.map((data) => {
                            return (<Post key={data._id} idx={data._id} setSelectedPost={props.setSelectedPost} data={data} localRemovePost={localRemovePost} currId={props.currId} />);
                        })
                    }
                </div>
                {/* Pagination things */}
                <div>
                {pageNum !== 1 ?
                  <Button className="m-2" onClick={() => {setPageNum(prevPage => prevPage-1); pageNumRef.current=pageNumRef.current-1}}>Previous</Button> :
                  ''}
                  {pageNum}
                  {posts.length !== 0 ?
                  <Button className="m-2" onClick={() => {setPageNum(prevPage => prevPage+1); ; pageNumRef.current=pageNumRef.current-1; pageNumRef.current=pageNumRef.current+1}}>Next></Button> :
                  ''}
                </div>
            </div>
            <div></div>
        </div>
    );

}
