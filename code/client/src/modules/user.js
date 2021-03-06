// import fetch
import host from '../host-config';
const fetch = require('node-fetch');


const getPostOptions = (params) => {
  return {
    method: 'POST',
    headers: {
      'Content-Type' : 'application/json'
    },
    credentials: 'include',
    body : JSON.stringify(params)
  }
}
async function fetchUserProfile(id) {
  const uri = `${host}/user/find/${id}`
  try{
    const response = await fetch(uri, {credentials: 'include'});
    return response.json();
  } catch (err) {
    alert(`Error: ${err}`);
  }
}

async function fetchUserByHandle(handle) {
  const uri = `${host}/user/search/${handle}`
  try{
    const response = await fetch(uri, {credentials: 'include'});
    return response.json();
  } catch (err) {
    alert(`Error: ${err}`);
  }
}
async function fetchSetAvatar(imagePath) {
  const uri = `${host}/user/avatar`
  const params = {
    imagePath : imagePath
  }
  const options = getPostOptions(params);
  try {
    const res = await fetch(uri, options);
    return res.text();
  } catch(err) {
    alert(`Error: ${err}`);
  }
}

async function fetchUserAvatar() {
  const uri = `${host}/user/avatar`
  try {
    const res = await fetch(uri, {credentials: 'include'});
    return res.text();
  } catch(err) {
    alert(`Error: ${err}`);
  }
}

async function fetchFollowUser(currId, id) {
  const params = {
      // currId : currId,
  };
  const options = getPostOptions(params)
  const uri = `${host}/user/follow/${id}`
  try{
    const response = await fetch(uri, options);
    return response.json();
  } catch (err) {
    alert(`Error: ${err}`);
  }
}

async function fetchUnfollowUser(currId, id) {
  const params = {
      // currId : currId,
  };
  const options = getPostOptions(params)
  const uri = `${host}/user/unfollow/${id}`
  try{
    const response = await fetch(uri, options);
    return response.json();
  } catch (err) {
    alert(`Error: ${err}`);
  }
}

async function fetchBlockUser(currId, id) {
  const params = {
      // currId : currId,
  };
  const options = getPostOptions(params)
  const uri = `${host}/user/block/${id}`
  try{
    const response = await fetch(uri, options);
    return response.json();
  } catch (err) {
    alert(`Error: ${err}`);
  }
}

async function fetchUnblockUser(currId, id) {
  const params = {
      // currId : currId,
  };
  const options = getPostOptions(params)
  const uri = `${host}/user/unblock/${id}`
  try{
    const response = await fetch(uri, options);
    return response.json();
  } catch (err) {
    alert(`Error: ${err}`);
  }
}

async function fetchFollowed(currId) {
  const uri = `${host}/user/followed`
  try{
    const response = await fetch(uri, {credentials: 'include'});
    return response.json();
  } catch (err) {
    alert(`Error: ${err}`);
  }
}

async function fetchFollowers(currId) {
  const uri = `${host}/user/followers`
  try{
    const response = await fetch(uri, {credentials: 'include'});
    return response.json();
  } catch (err) {
    alert(`Error: ${err}`);
  }
}

async function fetchSuggestions(currId) {
  const uri = `${host}/user/suggest`
  try{
    const response = await fetch(uri, {credentials: 'include'});
    return response.json();
  } catch (err) {
    alert(`Error: ${err}`);
  }
}

async function fetchChat(currId, id) {
  const uri = `${host}/user/chat/${id}`;
  try{
    const response = await fetch(uri, {credentials: 'include'});
    return response.json();
  } catch (err) {
    alert(`Error: ${err}`);
  }
}
async function fetchCall(currId, id) {
  const uri = `${host}/user/call/${id}`;
  try{
    const response = await fetch(uri, {credentials: 'include'});
    return response.json();
  } catch (err) {
    alert(`Error: ${err}`);
  }
}


export { fetchUserProfile, fetchFollowUser, fetchUnfollowUser, fetchFollowers,
  fetchFollowed, fetchChat, fetchCall, fetchUserByHandle, fetchSuggestions,
  fetchBlockUser, fetchUnblockUser, fetchSetAvatar, fetchUserAvatar };
