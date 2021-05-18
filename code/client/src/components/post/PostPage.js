import React, { useState } from 'react'
import PostFeed from './PostFeed';
import PostDetail from './PostDetail';

export default function PostPage(props) {
    const [selectedPost, setSelectedPost] = useState(null);
    return (
        <div style={{height:'92vh'}}>
            {selectedPost ?  
            <PostDetail currId={props.currId} selectedPost={selectedPost} setSelectedPost={setSelectedPost}/> 
            : <PostFeed currId={props.currId} setSelectedPost={setSelectedPost}/>
            }
        </div>
    );
}