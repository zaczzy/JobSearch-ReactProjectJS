// import fetch
const fetch = require('node-fetch');
const SHA256 = require('crypto-js/sha256');
const Base64 = require('crypto-js/enc-base64');


async function createUser(email, password, displayName, handle) {
    password = Base64.stringify(SHA256(password))
    const params = {
        email : email,
        password: password,
        displayName : displayName,
        handle : handle
    };
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
    }
    try {
        const response = await fetch('/register', options);
        return response.json();
    } catch (error) {
        alert(`Error: ${error}`);
    }
}

export { createUser };
