import React, { useState, useEffect } from 'react';
import { Modal, Form, Button }  from 'react-bootstrap';
import { fetchFollowed, fetchChat } from '../../modules/user';

export default function NewConversationModal(props) {
  // state
  const [selectedContactId, setSelectedContactId] = useState('');
  const [contacts, setContacts] = useState([]);

  // useEffect hooks
  useEffect(() => {
    async function fetchFollowedData() {
      const result = await fetchFollowed(props.currId);
      console.log('Contacts fetched:', result);
      setContacts(result);
      if (result.length > 0) {
        console.log('Setting selectedContactId');
        setSelectedContactId(result[0]._id.toString());
      }
    }
    fetchFollowedData();
  }, [props.currId]);

  function createConversation() {
    fetchChat(props.currId, selectedContactId)
    .then(result => {
      console.log('Created Chat');
    })
  }

  function handleSubmit(e) {
    e.preventDefault();
    createConversation();
    props.closeModal();
  }

  function handleSelectChange(contactId) {
    setSelectedContactId(contactId.toString());
  }

  return (
    <>
      <Modal.Header closeButton>Create Conversation</Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {contacts.map(contact => (
            <Form.Group controlId={contact._id} key={contact._id}>
              <Form.Control as="select"
                onChange={() => handleSelectChange(contact._id)}>
                <option value={contact._id}>{contact.handle}</option>
              </Form.Control>
            </Form.Group>
          ))}
          <Button type="submit">Create</Button>
        </Form>
      </Modal.Body>
    </>
  );
}
