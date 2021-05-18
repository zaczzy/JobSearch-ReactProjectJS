import React, { useState, useEffect, Component } from 'react';
import Post from './post/Post'
import Comment from './post/Comment'

import { fetchPostsFromUser, createPost} from '../modules/post';
import {fetchUserAvatar} from '../modules/user';

export default function SearchFeed(props) {

    const [posts, setPosts] = useState([]);
    const [comments, setComments] = useState([]);

    useEffect(() => {
      setPosts(props.posts)
      setComments(props.comments)
    }, [])

    const deletePost = (id) => {
        // console.log(`delete post called ${id}`);
        setPosts(prevPosts =>
          prevPosts.filter(p => p._id !== id)
        );
    }
    const deleteComment = (id) => {
        setComments(prevComments =>
            prevComments.filter(p=> p._id != id));
    }
    return (
        <div className='d-flex flex-row justify-content-between' style={{ height: '100%' }}>
            <div className="border-left border-right" style={{width: '100%'}}>
                {/* Your posts */}
                <div>
                    {props.posts && <p>Posts:</p>}
                    {props.posts &&
                      props.posts.map((data) => {
                          return (<Post key={data._id} idx={data._id} data={data} deletePost={deletePost} currId={props.currId} />);
                      })
                    }
                    {props.comments && <p>Comments:</p>}
                    {props.comments &&
                      props.comments.map((comment) => {
                        return (
                            <Comment key={comment._id} idx={comment._id} data={comment} deleteComment={deleteComment} currId={props.currId} />
                        );
                      })
                    }
                </div>
            </div>

        </div>
    );

}
