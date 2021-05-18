import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { fetchUnfollowUser, fetchChat } from '../../modules/user';

export default function ContactInfo(props) {
  const history = useHistory();

  // event handlers
  function createChat(otherId) {
    fetchChat(props.currId, otherId.toString())
    .then(result => {
      console.log('Created Chat');
      // redirect router to chats
      history.push('/chats');
    })
  }

  function unfollowUser(otherId) {
    fetchUnfollowUser(props.currId, otherId.toString())
    .then(unfollowRes => {
      console.log('User unfollowed', unfollowRes);
      props.setLastAction('unfollow');
    })
  }

  return (
    <div className="ContactInfo">
      <Card>
        <Card.Body>
          <Card.Title>{props.contact.displayName}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">{props.contact.handle}</Card.Subtitle>
          <Button variant="outline-primary" className="mx-2" onClick={e => createChat(props.contact._id)}>
            Chat
          </Button>
          <Button variant="outline-warning" className="mx-2" onClick={e => unfollowUser(props.contact._id)}>
            Unfollow
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
}
