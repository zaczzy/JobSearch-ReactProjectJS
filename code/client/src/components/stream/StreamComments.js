import React, { useState, useEffect } from 'react'
import { Card, Button, Container, Form } from 'react-bootstrap';
import { commentOnStream, fetchStreamComments } from '../../modules/stream';

export default function StreamComments(props) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');

  // comments on initial load
  useEffect(() => {
    async function fetchData() {
      fetchStreamComments(props.currStream._id.toString())
      .then(commentsRes => {
        const coms = commentsRes.stream[0].comments
        setComments(coms);
      })
    }
    fetchData();
  }, [])

  // event handlers
  function getComments(e) {
    e.preventDefault();
    fetchStreamComments(props.currStream._id.toString())
    .then(commentsRes => {
      const coms = commentsRes.stream[0].comments
      setComments(coms);
    });
  }
  function addComment(e) {
    e.preventDefault();
    if (text !== "") {
      // do search
      commentOnStream(props.currId, props.currStream._id.toString(), text)
      .then(results => {
        console.log('Comment result:', results);
        // fetch comments from backend
        fetchStreamComments(props.currStream._id.toString())
        .then(commentsRes => {
          console.log('CommentsRes', commentsRes.stream[0].comments)
          const coms = commentsRes.stream[0].comments
          setComments(coms);
          // reset text
          setText('');
        })
      })
    }
  }

  return (
    <Container>
      <Button variant="outline-primary" className="my-2" onClick={getComments}>
        Get Latest Comments
      </Button>
      {comments &&
        comments.map((comment, i) => (
          <Card key={i}>
            <Card.Body>
              <Card.Title>{comment.owner.displayName}</Card.Title>
              <Card.Text>{comment.content}</Card.Text>
            </Card.Body>
          </Card>
        ))}
        <Form onSubmit={addComment}>
          <Form.Group controlId="searchTerm">
            <Form.Label>Add a comment?</Form.Label>
            <Form.Control type="text"
              placeholder="Add comment"
              value={text}
              onChange={e => setText(e.target.value)}
            />
          </Form.Group>
          <Button variant="outline-primary" className="my-2" type="submit">
            Comment
          </Button>
        </Form>

    </Container>
  );
}
