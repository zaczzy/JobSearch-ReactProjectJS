import React, { useState, useEffect } from 'react'
import { Container, Form, Card, Button } from 'react-bootstrap';
import { fetchUserByHandle, fetchUnfollowUser, fetchFollowUser,
  fetchBlockUser, fetchUnblockUser } from '../modules/user';
import { fetchPostsMentions, fetchPostsHashtags,
  fetchCommentsHashtags, fetchCommentsMentions } from '../modules/post'
import SearchFeed from './SearchFeed';

export default function SearchPage(props) {
  const [text, setText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [commentResults, setCommentResults] = useState([]);
  const [type, setType] = useState('User');
  const [recentRequest, setRecentRequest] = useState('');

  useEffect(() => {
    setSearchResults([])
    setCommentResults([])
  }, [type])
  // event handlers
  function submitSearch(e) {
    e.preventDefault();
    if (text !== "") {
      // do search
      if(type === 'User') {
        fetchUserByHandle(text)
        .then(results => {
          // filter users
          setSearchResults(Array.from(results.profiles));
        })
      } else if(type === 'Tag') {
        fetchPostsHashtags(text)
        .then(results => {
          setSearchResults(Array.from(results.posts))
          // get comment results
          fetchCommentsHashtags(text)
          .then(comRes => {
            console.log('ComRes', comRes)
            setCommentResults(Array.from(comRes.comments))
          });
        })
      } else if(type === 'Mention') {
        // TODO: search posts by mentions
        fetchPostsMentions(text)
        .then(results => {
          setSearchResults(Array.from(results.posts))
          // get comment results
          fetchCommentsMentions(text)
          .then(comRes => {
            setCommentResults(Array.from(comRes.comments))
          });
        })
      }

      // reset text
      setText('');
    }
  }
  function followUser(tgtId) {
    fetchFollowUser(props.currId, tgtId.toString())
    .then(result => {
      if(result.message) {
        console.log('User already followed');
        setRecentRequest('already');
      } else {
        console.log('Sucessfully followed user', result);
        setRecentRequest('success');
      }
    })
  }
  function unfollowUser(tgtId) {
    fetchUnfollowUser(props.currId, tgtId.toString())
    .then(result => {
      if(result.message !== 'success') {
        console.log('User not followed')
        setRecentRequest('already');
      } else {
        console.log('User unfollowed', result);
        setRecentRequest('success');
      }
    })
  }
  function blockUser(tgtId) {
    fetchBlockUser(props.currId, tgtId.toString())
    .then(result => {
      if(result.message !== 'success') {
        console.log('User already blocked')
        setRecentRequest('already');
      } else {
        console.log('User blocked', result);
        setRecentRequest('success');
      }
    })
  }
  function unblockUser(tgtId) {
    fetchUnblockUser(props.currId, tgtId.toString())
    .then(result => {
      if(result.message !== 'success') {
        console.log('User not currently blocked')
        setRecentRequest('already');
      } else {
        console.log('User unblocked', result);
        setRecentRequest('success');
      }
    })
  }
  return (
    <Container>
      <Form onSubmit={submitSearch}>
        <Form.Group controlId="searchTerm">
          <Form.Label>Find a Post</Form.Label>
          <Form.Control type="text"
            placeholder="Enter handle or tag"
            value={text}
            onChange={e => setText(e.target.value)}
          />
          <Form.Text className="text-muted">
            Pick a tab below to change what you search for
          </Form.Text>
        </Form.Group>
        <Form.Group controlId="searchType">
          <Form.Control as="select"
            onChange={(e) => setType(e.target.value)}>
            <option value="User">User</option>
            <option value="Tag">Tag</option>
            <option value="Mention">Mention</option>
          </Form.Control>
        </Form.Group>
        <Button variant="outline-primary" type="submit">
          Search
        </Button>
      </Form>
      {recentRequest && (
        <>
          {recentRequest === 'success' ?
          <span>Operation Sucessful</span> :
          <span>This request is not valid</span>
          }
        </>
      )
      }
      { type === 'User' &&
        searchResults.map(user => (
          <Card key={user._id}>
            <Card.Body>
              <Card.Title>{user.displayName}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">{user.handle}</Card.Subtitle>
              <Button variant="outline-primary" className="mx-2" onClick={e => followUser(user._id)}>
                Follow
              </Button>
              <Button variant="outline-primary" className="mx-2" onClick={e => unfollowUser(user._id)}>
                Unfollow
              </Button>
              <Button variant="outline-warning" className="mx-2" onClick={e => blockUser(user._id)}>
                Block
              </Button>
              <Button variant="outline-warning" className="mx-2" onClick={e => unblockUser(user._id)}>
                Unblock
              </Button>
            </Card.Body>
          </Card>
        ))
      }
      { type === 'Tag' && searchResults &&
        <SearchFeed currId={props.currId} posts={searchResults} comments={commentResults} />
      }
      { type === 'Mention' && searchResults &&
        <SearchFeed currId={props.currId} posts={searchResults} comments={commentResults} />
      }
    </Container>
  );
}
