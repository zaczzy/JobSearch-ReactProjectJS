import React, { useState, useCallback } from 'react'
import Lobby from './Lobby';
import Room from './Room';
import { fetchVideoToken } from '../../modules/stream';

import host from '../../host-config';

export default function VideoChat(props) {
  // State
  const [username, setUsername] = useState('');
  const [roomName, setRoomName] = useState('');
  const [token, setToken] = useState(null);
  const [title, setTitle] = useState('Test');

  // event handlers
  const handleUsernameChange = useCallback(event => {
    setUsername(event.target.value);
  }, []);

  const handleRoomNameChange = useCallback(event => {
    setRoomName(event.target.value);
  }, []);

  const handleSubmit = useCallback(event => {
    event.preventDefault();
    fetchVideoToken(username, roomName)
    .then(data => {
      setToken(data.token);
    })
  }, [username, roomName]);


  const handleLeaveStream = useCallback(event => {
    setToken(null);
  }, []);

  return (
    <div>
      {token ? (
        <Room roomName={roomName} token={token} title={title} handleLeaveStream={handleLeaveStream} />
      ) : (
      <Lobby
         username={username}
         roomName={roomName}
         handleUsernameChange={handleUsernameChange}
         handleRoomNameChange={handleRoomNameChange}
         handleSubmit={handleSubmit}
      />
    )}
    </div>
  );
}
