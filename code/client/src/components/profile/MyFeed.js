import React, { useState, useEffect, Component, useRef } from 'react';
import Post from '../post/Post'

import { fetchPostsFromUser, createPost} from '../../modules/post';

export default function MyFeed(props) {

    const [posts, setPosts] = useState([]);
    const [currAvatar, setCurrAvatar] = useState(null);
    const intervalRef = useRef();

    useEffect(async () => {
        const posts = await fetchPostsFromUser(props.currId);
        setPosts(posts);
        
        // live update
        intervalRef.current = setInterval(() => getUpdatedposts(), 4000);
        return () => {
            clearInterval(intervalRef.current);
        };
    }, []);
    function getUpdatedposts(isMounted) {
        fetchPostsFromUser(props.currId)
            .then(newPosts => {
                if (isMounted) setPosts(newPosts);
            })
    }
    const deletePost = (id) => {
        // console.log(`delete post called ${id}`);
        setPosts(prevPosts =>
          prevPosts.filter(p => p._id !== id)
        );
    }
    return (
        <div className='d-flex flex-row justify-content-between' style={{ height: '100%' }}>
            <div className="border-left border-right" style={{width: '100%'}}>
                {/* Your posts */}
                <div>
                    {
                        posts.map((data) => {
                            return (<Post key={data._id} idx={data._id} setSelectedPost={props.setSelectedPost} data={data} deletePost={deletePost} currId={props.currId}/>);
                        })
                    }
                </div>
            </div>

        </div>
    );

}
