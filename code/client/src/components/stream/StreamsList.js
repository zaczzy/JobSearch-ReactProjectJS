import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import StreamInfo from './StreamInfo';
import Room from './Room';
import StreamComments from './StreamComments';
import { fetchStreams, fetchCreateStream, fetchVideoToken, endStream, fetchAddParticipant } from '../../modules/stream';
import { fetchUserProfile} from '../../modules/user';

export default function StreamsList(props) {
  // state
  const [allStreams, setAllStreams] = useState([]);
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState('');
  const [roomName, setRoomName] = useState('');
  const [title, setTitle] = useState('');
  const [hosting, setHosting] = useState(false);
  const [currStream, setCurrStream] = useState(null);

  const currStreamRef = useRef(currStream);
  const usernameRef = useRef(username);
  const roomNameRef = useRef(roomName);

  // useEffect
  // fetch streams on load
  useEffect(() => {
    async function fetchData() {
      const result = await fetchStreams(props.currId);
      setAllStreams(Array.from(result));
    }
    fetchData();
  }, [hosting])

  // event handlers

  const handleSubmit = useCallback(event => {
    event.preventDefault();
    console.log('Username:', usernameRef.current, 'Room Name', roomNameRef.current)
    fetchVideoToken(usernameRef.current, roomNameRef.current)
    .then(data => {
      console.log('Token received was', data.token);
      setToken(data.token);
    })
  }, [username, roomName]);

  const handleLeaveStream = useCallback(event => {
    setToken(null);
    console.log('Left room, hosting is:', hosting)
    setHosting(false);
  }, []);

  const handleEndStream = useCallback(event => {
    setToken(null);
    console.log('Left room, hosting is:', hosting)
    endStream(currStreamRef.current._id.toString())
    .then(endRes => {
      setCurrStream(null);
      setHosting(false);
    })
  }, []);

  // event handlers
  function createStream(e) {
    e.preventDefault();
    fetchUserProfile(props.currId)
    .then(myUser => {
      usernameRef.current = myUser.profile.handle;
      setUsername(usernameRef.current);
      fetchCreateStream(props.currId, title)
      .then(result => {
        console.log('Created stream returned', result);
        currStreamRef.current = result;
        setCurrStream(currStreamRef.current);
        setHosting(true);
        roomNameRef.current = result.title;
        setRoomName(roomNameRef.current)
        handleSubmit(e);

        // setShowRoom(true)
      })
    })
  }

  return (
    <Container>
      {token ? (
        <div>
          <Room roomName={roomName} token={token} title={title}
          handleLeaveStream={handleLeaveStream} hosting={hosting}
          handleEndStream={handleEndStream} />
          <StreamComments currId={props.currId} currStream={currStream} />
        </div>
      ) : (
        <div>
          <Form onSubmit={createStream}>
            <Form.Group controlId="streamTitle">
              <Form.Label>Start a New Stream</Form.Label>
              <Form.Control type="text"
                placeholder="Enter title"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
            </Form.Group>
            <Button variant="outline-primary" className="my-2" type="submit">
              Create
            </Button>
          </Form>
          {allStreams.map(stream => (
            <StreamInfo key={stream._id}
              stream={stream}
              currId={props.currId}
              setToken={setToken}
              setUsername={setUsername}
              setRoomName={setRoomName}
              usernameRef={usernameRef}
              roomNameRef={roomNameRef}
              setTitle={setTitle}
              handleSubmit={handleSubmit}
              setCurrStream={setCurrStream}
            />
          ))}
        </div>
      )}
    </Container>
  );
}
