import React, { useState, useEffect } from 'react';
import Video from 'twilio-video';
import Participant from './Participant';

export default function Room({ roomName, token, title, hosting, handleEndStream, handleLeaveStream }) {
  // state
  const [room, setRoom] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [isHost, setIsHost] = useState([]);
  const [ended, setEnded] = useState(null);
  const [host, setHost] = useState(null);

  const remoteParticipants = participants.map((participant, i) => (
    <Participant key={participant.sid} participant={participant} hosting={isHost[i]}/>
  ));

  function removeItemOnce(arr, index) {
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
  }

  useEffect(() => {

    const participantConnected = participant => {
      setParticipants(prevParticipants => [...prevParticipants, participant]);
      setIsHost(prevHost => [...prevHost, hosting])
    };
    const participantDisconnected = participant => {
      if(hosting) {
        setParticipants([])
        setIsHost([])
        setEnded(true)
        console.log('Disconnecting as host')
      } else {
        const idx = participants.findIndex(participant)
        setParticipants(prevParticipants =>
          prevParticipants.filter(p => p !== participant)
        );
        setIsHost(prevHost =>
          removeItemOnce(prevHost, idx)
        );
      }
    };
    Video.connect(token, {
      name: roomName
    }).then(room => {
      setRoom(room);
      room.on('participantConnected', participantConnected);
      room.on('participantDisconnected', participantDisconnected);
      room.participants.forEach(participantConnected);
      // set host to localParticipant
      if(hosting) {
        setHost(room.localParticipant)
      }
    });
    // clean up
    return () => {
      setRoom(currentRoom => {
        if (currentRoom && currentRoom.localParticipant.state === 'connected') {
          currentRoom.localParticipant.tracks.forEach(function(trackPublication) {
            trackPublication.track.stop();
          });
          currentRoom.disconnect();
          return null;
        } else {
          return currentRoom;
        }
      });
    };
  }, [roomName, token]);

  return (
    <div className="room">
      <h2>Room: {title}</h2>
      {hosting ? (
        <button onClick={handleEndStream}>End Stream</button>
      ) : (
        <button onClick={handleLeaveStream}>Leave Stream</button>
      )}
      <div className="local-participant">
        {room && hosting ? (
          <Participant
            key={room.localParticipant.sid}
            participant={room.localParticipant}
            hosting={hosting}
          />
        ) : (
          ''
        )}
      </div>
      <h3>Currently watching {participants.length}</h3>
      {!hosting ? (
        <div className="remote-participants">{remoteParticipants}</div>
      ): (
        ''
      )}
      {ended &&
        <div className="ended">
          The Stream you were watching has ended
        </div>
      }
    </div>
  );
}
