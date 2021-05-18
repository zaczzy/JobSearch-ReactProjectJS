import host from '../host-config';
const fetch = require('node-fetch');

async function logout(currId) {
  const uri = `${host}/logout`
  try{
    const response = await fetch(uri, {credentials: 'include'});
    return response.json();
  } catch (err) {
    alert(`Error: ${err}`);
  }
}

export { logout };
