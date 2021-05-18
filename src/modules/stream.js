import host from '../host-config';
const fetch = require('node-fetch');

async function fetchStreams(currId) {
  const uri = `${host}/api/stream/list`
  try{
    const response = await fetch(uri, {credentials: 'include'});
    return response.json();
  } catch (err) {
    alert(`Error in get: ${err}`);
  }
}

async function fetchStreamComments(sid) {
  const uri = `${host}/api/stream/comments/${sid}`
  try{
    const response = await fetch(uri, {credentials: 'include'});
    return response.json();
  } catch (err) {
    alert(`Error in get: ${err}`);
  }
}


async function fetchCreateStream(currId, title) {
  const uri = `${host}/api/stream/create`
  const options = {
    method: 'POST',
    body: JSON.stringify({
      title: title,
    }),
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  }
  try{
    const response = await fetch(uri, options);
    return response.json();
  } catch (err) {
    console.err(`Error in post: ${err}`);
  }
}

async function fetchAddParticipant(currId, streamId) {
  const uri = `${host}/api/stream/add`
  const options = {
    method: 'POST',
    body: JSON.stringify({
      streamId: streamId,
    }),
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  }
  try{
    const response = await fetch(uri, options);
    return response.json();
  } catch (err) {
    console.err(`Error in post: ${err}`);
  }
}

async function commentOnStream(currId, sid, comment) {
    const uri = `${host}/api/comments/stream/newcomment/${sid}`
    const params = {
        message: comment
    }
    const options = {
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(params)
    }
    try {
        const res = await fetch(uri, options);
        return res.json();
    } catch (err) {
        alert(`Error: ${err}`);
    }
}

async function fetchVideoToken(username, roomName) {
  const uri = `${host}/api/stream/video/token`
  const options = {
    method: 'POST',
    body: JSON.stringify({
      identity: username,
      room: roomName
    }),
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  }
  try{
    const response = await fetch(uri, options);
    return response.json();
  } catch (err) {
    alert(`Error: ${err}`);
  }
}

async function endStream(sid) {
  const uri = `${host}/api/stream/end/${sid}`
  try{
    const response = await fetch(uri, {credentials: 'include'});
    return response.json();
  } catch (err) {
    alert(`Error in get: ${err}`);
  }
}

export { fetchStreams, fetchCreateStream, fetchAddParticipant,
  commentOnStream, fetchStreamComments, endStream, fetchVideoToken };
