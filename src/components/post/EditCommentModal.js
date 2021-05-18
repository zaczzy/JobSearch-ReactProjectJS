import React, { useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import {updateComment} from '../../modules/post';

export default function EditCommentModal(props) {
    // state
    // const [selectedContactId, setSelectedContactId] = useState('');
    const [inputText, setInputText] = useState(null);
    // useEffect hooks
    // useEffect(() => {
    //   async function fetchFollowedData() {
    //     const result = await fetchFollowed(props.currId);
    //     console.log('Contacts fetched:', result);
    //     setContacts(result);
    //     if (result.length > 0) {
    //       console.log('Setting selectedContactId');
    //       setSelectedContactId(result[0]._id.toString());
    //     }
    //   }
    //   fetchFollowedData();
    // }, [props.currId]);

    // function createConversation() {
    //   fetchChat(props.currId, selectedContactId)
    //   .then(result => {
    //     console.log('Created Chat');
    //   })
    // }

    async function handleSubmit(e) {
        e.preventDefault();
        await updateComment(props.cmid, inputText);
        props.refreshPage();
        props.closeModal();
    }

    return (
        <>
            <Modal.Header closeButton>Input Comment Here</Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="exampleForm.ControlTextarea1">
                        <Form.Control as="textarea" required rows={3} value={inputText} onChange={e=>setInputText(e.target.value)}/>
                    </Form.Group>
                    <Button type="submit">Done</Button>
                </Form>
            </Modal.Body>
        </>
    );
}