import React, { useState } from "react";
import Axios from "axios";
import { Form } from 'antd';
import { Link, useHistory } from 'react-router-dom';
import host from '../host-config';
import { Alert } from 'react-bootstrap';

function LoginForm(props) {

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginField, setLoginField] = useState('');
  const [resData, setResData] = useState(null);
  const history = useHistory();

  const login = () => {
    Axios({
      method: "POST",
      data: {
        email: loginEmail,
        password: loginPassword,
      },
      withCredentials: true,
      url: `https://agileman.herokuapp.com/api/login`,
    }).then((res) => {
      console.log(res.data);
      // Error checking here
      if (res.data.message === "Successfully Authenticated") {
        props.setCurrId(res.data.userObj._id.toString())
        setLoginField('success');
        // redirect router to posts
        history.push('/profile');
      }
      else if (res.data.message === "User Not Found") {
        setLoginField('DNE')
      }
      else if (res.data.includes("locked out")) {
        setResData(res.data);
      }
      else {
        setLoginField('error')
      }
    })
      .catch(error => { console.log(error) });;
  };


  function validateForm() {
    return loginEmail.length > 0 && loginPassword.length > 0;
  }

  return (
    <div className="App">
      <div>
        <h1 id="title">Login</h1>
        <input
          id="email"
          placeholder="email"
          onChange={(e) => setLoginEmail(e.target.value)}
        />
        <input
          id="password"
          type="password"
          placeholder="password"
          onChange={(e) => setLoginPassword(e.target.value)}
        />
        <button id="loginButton" onClick={login} disabled={!validateForm()}>Submit</button>
      </div>

      {loginField &&
        loginField === 'success' &&
        <p>User Successfully Logged In.</p>}
      {loginField &&
        loginField === 'error' &&
        <p id="response1">Invalid password.</p>}
      {loginField &&
        loginField === 'DNE' &&
        <p id="response2">Could not find user.</p>}


      <Form.Item>
        <Link to="/register">Register</Link>
      </Form.Item>
      <Form.Item>
        <Link to="/resetPassword">Forgot Password?</Link>
      </Form.Item>
      {resData && <Alert key="alert" variant="danger">{resData}</Alert>}
    </div>
  );
}

export default LoginForm;
