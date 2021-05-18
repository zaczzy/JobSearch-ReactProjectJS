import React, { useState } from 'react'
import { fetchUserByHandle, fetchFollowUser, fetchSuggestions } from '../../modules/user';
import { Container, Form, ListGroup, Button } from 'react-bootstrap';

export default function ContactSearch(props) {
  const [text, setText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [recentFollow, setRecentFollow] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // event handlers
  function submitSearch(e) {
    e.preventDefault();
    if (text !== "") {
      // do search
      fetchUserByHandle(text)
      .then(results => {
        console.log('Search results', results);
        setSearchResults(Array.from(results.profiles));
      })
      // reset text
      setText('');
    }
  }

  function getSuggestions() {
    // get followed from backend
    fetchSuggestions(props.currId)
    .then(suggestionRes => {
      console.log('got suggestions', suggestionRes);
      setSuggestions(suggestionRes);
      setShowSuggestions(true);
    })
  }

  function followUser(tgtId) {
    fetchFollowUser(props.currId, tgtId.toString())
    .then(result => {
      if(result.message) {
        console.log('User already followed');
        setRecentFollow('already')
      } else {
        console.log('Sucessfully followed user', result);
        setRecentFollow('success');
        props.setLastAction('follow');
      }

    })
  }
  return (
    <Container>
      <Form onSubmit={submitSearch}>
        <Form.Group controlId="searchTerm">
          <Form.Label>Follow a User</Form.Label>
          <Form.Control type="text"
            placeholder="Enter handle"
            value={text}
            onChange={e => setText(e.target.value)}
          />
          <Form.Text className="text-muted">
            Click the a result to follow that user
          </Form.Text>
        </Form.Group>
        <Button variant="outline-primary" className="my-2" type="submit">
          Search
        </Button>
      </Form>
      {recentFollow &&
        recentFollow === 'success' &&
      <p>User Sucessfully Followed</p>}
      {recentFollow &&
        recentFollow === 'already' &&
      <p>You already follow this user</p>}
      <ListGroup>
        {
          searchResults.map(user => (
            <ListGroup.Item key={user._id} action onClick={e => followUser(user._id)}>
              Handle: {user.handle} , Name: {user.displayName}
            </ListGroup.Item>
          ))
        }
      </ListGroup>
      <Button onClick={e => getSuggestions()}> Get Suggestions? </Button>
      {showSuggestions &&
      <ListGroup>
        {
          suggestions.map(user => (
            <ListGroup.Item key={user._id} action onClick={e => followUser(user._id)}>
              Handle: {user.handle} , Name: {user.displayName}
            </ListGroup.Item>
          ))
        }
      </ListGroup>
      }
    </Container>
  );
}
