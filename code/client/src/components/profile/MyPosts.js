import React, { useState } from 'react'
import MyFeed from './MyFeed';
import PostDetail from '../post/PostDetail';

export default function MyPosts(props) {
    const [selectedPost, setSelectedPost] = useState(null);
    return (
        <div style={{height: '100%'}}>
            {selectedPost ?  
            <PostDetail currId={props.currId} selectedPost={selectedPost} setSelectedPost={setSelectedPost}/> 
            : <MyFeed currId={props.currId} setSelectedPost={setSelectedPost}/>
            }
        </div>
    );
}