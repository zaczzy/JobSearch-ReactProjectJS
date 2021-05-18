import React from 'react'
import { Card, Button } from 'react-bootstrap';
import { fetchFollowUser, fetchBlockUser } from '../../modules/user';

export default function FollowerInfo(props) {

  // event handlers
  function followUser(tgtId) {
    fetchFollowUser(props.currId, tgtId.toString())
    .then(result => {
      props.setLastAction('follow');
    })
  }

  function blockUser(tgtId) {
    fetchBlockUser(props.currId, tgtId.toString())
    .then(result => {
      props.setLastAction('block');
    })
  }

  return (
    <div>
      <Card>
        <Card.Body>
          <Card.Title>{props.contact.displayName}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">{props.contact.handle}</Card.Subtitle>
          <Button variant="outline-primary" className="mx-2" onClick={e => followUser(props.contact._id)}>
            Follow
          </Button>
          <Button variant="outline-warning" className="mx-2" onClick={e => blockUser(props.contact._id)}>
            Block
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
}
