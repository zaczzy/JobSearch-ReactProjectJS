import React, { useState } from "react";
import Axios from "axios";
import { Form } from 'antd';
import { Link, useHistory } from 'react-router-dom';
import host from '../host-config';

function LoginForm(props) {

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginField, setLoginField] = useState('');
  const history = useHistory();

  const login = () => {
    Axios({
      method: "POST",
      data: {
        email: loginEmail,
        password: loginPassword,
      },
      withCredentials: true,
      url: `${host}/login`,
    }).then((res) => {
      // console.log(res.data.userObj);
      // console.log(res.data.message);
      if(res.data.message === "Successfully Authenticated"){
        props.setCurrId(res.data.userObj._id.toString())
        setLoginField('success')
        // redirect router to posts
        history.push('/profile');
      }
      if(res.data.message === "User Not Found"){   
        setLoginField('DNE')
      }
      else{
        setLoginField('error')
      }
    })
    .catch(error => {console.log(error.response)});;
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
    </div>
  );
}

export default LoginForm;
