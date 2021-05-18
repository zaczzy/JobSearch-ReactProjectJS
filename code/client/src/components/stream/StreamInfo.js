import React from 'react';
import { Card, Button, Container } from 'react-bootstrap';
import { useState } from 'react-router-dom';
import { fetchVideoToken, fetchAddParticipant } from '../../modules/stream';
import { fetchUserProfile } from '../../modules/user';

export default function StreamInfo(props) {

  // event handlers
  function joinStream(e) {
    // TODO

    props.roomNameRef.current = props.stream.title
    props.setRoomName(props.roomNameRef.current)
    props.setTitle(props.stream.title)
    props.setCurrStream(props.stream)
    // Update Stream backend user list
    fetchAddParticipant(props.currId, props.stream._id.toString())
    .then(addRes => {
      if(addRes.receipt) {
        fetchUserProfile(props.currId)
        .then(myUser => {
          props.usernameRef.current = myUser.profile.handle
          props.setUsername(props.usernameRef.current);
          props.handleSubmit(e);
        })
      }
    })
  }

  return (
    <div className="StreamInfo">
      <Card>
        <Card.Body>
          <Card.Title>{props.stream.title}</Card.Title>
          <Button variant="outline-primary" className="mx-2" onClick={e => joinStream(e)}>
            Join
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
}
