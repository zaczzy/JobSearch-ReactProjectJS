import host from '../host-config';
const fetch = require('node-fetch');


async function fetchChats(currId) {
  const uri = `${host}/api/chat`
  try{
    const response = await fetch(uri, {credentials: 'include'});
    return response.json();
  } catch (err) {
    alert(`Error: ${err}`);
  }
}

async function fetchChatWithUser(currId, cId) {
  const uri = `${host}/api/chat/${cId}`
  try{
    const response = await fetch(uri, {credentials: 'include'});
    return response.json();
  } catch (err) {
    alert(`Error: ${err}`);
  }
}

async function fetchSendChat(currId, cId, message) {
  const params = {
    message: message
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
    const res = await fetch(`${host}/api/chat/${cId}/send`, options);
    return res.json();
  } catch (err) {
    alert(`Error: ${err}`);
  }
}

async function fetchSendUpload(currId, cId, url, type) {
  let params;
  if(type === 0) {
    params = {
      type: 0,
      imgurl: url,
      audiourl: null
    }
  } else {
    params = {
      type: 3,
      imgurl: null,
      audiourl: url
    }
  }
  const options = {
    method: 'POST',
    headers: {
      'Content-Type' : 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(params)
  }
  console.log('In fetch', options.body);
  try {
    const res = await fetch(`${host}/api/chat/${cId}/upload`, options);
    return res.json();
  } catch (err) {
    alert(`Error: ${err}`);
  }
}

export { fetchChats, fetchChatWithUser, fetchSendChat, fetchSendUpload};
