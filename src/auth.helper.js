import axios from 'axios';
import jwtDecode from 'jwt-decode';

// instantiate axios client
const httpClient = axios.create();
const tokenName = 'user';
const domain =
  !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
    ? 'http://localhost:5000'
    : '';

httpClient.getToken = function () {
  return localStorage.getItem(tokenName);
};

httpClient.setToken = function (token) {
  localStorage.setItem(tokenName, token);
  return token;
};

httpClient.getCurrentUser = function () {
  const token = this.getToken();
  if (token) return jwtDecode(token);
  return null;
};

httpClient.logIn = function (email, password) {
  return this({
    method: 'post',
    url: domain + '/api/login',
    data: { email, password },
  }).then((serverResponse) => {
    const token = serverResponse.data.token;
    if (token) {
      // sets token as an included header for all api requests
      this.defaults.headers.common.Authorization =
        'Bearer ' + this.setToken(token);
      return jwtDecode(token);
    } else {
      return false;
    }
  });
};

httpClient.signUp = function (email, password, firstName, lastName) {
  return this({
    method: 'post',
    url: domain + '/api/register',
    data: { email, password, firstName, lastName },
  })
    .then((serverResponse) => true)
    .catch((err) => false);
};

httpClient.logOut = function () {
  localStorage.removeItem(tokenName);
  delete this.defaults.headers.common.token;
  return true;
};

httpClient.defaults.headers.common.Authorization =
  'Bearer ' + httpClient.getToken();

export default httpClient;
