import React, { useEffect} from 'react';
import styled from 'styled-components';
import { Button } from 'react-bootstrap';

import {commentOnPost} from '../../modules/post';
import host from '../../host-config';
export default function CommentInput(props) {

    const Container = styled.div`
        width: 100%;
        height: 20%;
        max-height: 250px;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: stretch;
        .avt {
            margin-left: 10px;
            margin-top: 10px;
            .avatar {
                border-radius: 50%;
                max-height: 75px;
                max-width: 75px;
                margin-right: 10px
            }
        }
        .stack {
            margin-top: 10px;
            margin-right: 10px;
            width: 100%;
            display: flex;
            flex-direction: column;
        }
    `;
    // useEffect(()=>{
    //     console.log(props.currUser);
    // }, [])
    const postComment = async () => {
        const textArea = document.getElementById('yourComment');
        console.log(props.pid);
        const hashtags = textArea.value.match(/#\w+/g);
        const mentions = textArea.value.match(/@\w+/g);
        const res = await commentOnPost(props.pid, textArea.value, hashtags, mentions);
        // console.log(res);
        if (res === "success") {
            props.refreshPage();
        }
        textArea.value = "";
    }
    return (
        <Container>
            <div className="avt">
            <img className='avatar' src={props.currUser.profile.profilePic? host + props.currUser.profile.profilePic : 'https://via.placeholder.com/75x75'} />
            </div>
            <div className="stack">
                <textarea id="yourComment" style={{ height: '100%', minHeight: "100px" }} placeholder="Your Comment Here." />
                <Button variant="primary" onClick={postComment}>Comment</Button>
            </div>
        </Container>
    );
}
