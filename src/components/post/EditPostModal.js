import React from 'react';
import { Modal, Form, Button } from 'react-bootstrap';


export default function EditPostModal(props) {
    // state
    // const [selectedContactId, setSelectedContactId] = useState('');

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

    function handleSubmit(e) {
        e.preventDefault();
        //   createConversation();
        props.closeModal();
    }

    return (
        <>
            <Modal.Header closeButton>Write Something new</Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="exampleForm.ControlTextarea1">
                        <Form.Control as="textarea" rows={3} />
                    </Form.Group>
                    <Button type="submit">Done</Button>
                </Form>
            </Modal.Body>
        </>
    );
}