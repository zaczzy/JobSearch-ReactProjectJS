import React, { useState } from "react";
import { Form } from 'antd';
import Axios from "axios";
import { Link, useHistory } from 'react-router-dom';
import host from '../host-config';
import {logout} from '../modules/logout';

function Deactivate(props) {

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginField, setLoginField] = useState('');
  const history = useHistory();

  const deactivateUser = () => {
    Axios({
      method: "POST",
      data: {
        email: loginEmail,
        password: loginPassword,
      },
      withCredentials: true,
      url: `${host}/api/deactivate`,
    }).then((res) => {
      console.log(res);
      console.log(res.data.userObj);
      if(res.data === "Incorrect Credentials."){
        setLoginField('error')
      }
      else{
        setLoginField('success')
        logout(props.currId)
        .then(result => {
          if(result.message === "Successfully logged out") {
            props.setCurrId('')
          }
        });
        history.push('/login');
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
        <h1>Deactivate Account</h1>
        <input
          placeholder="email"
          onChange={(e) => setLoginEmail(e.target.value)}
        />
        <input
          placeholder="password"
          type="password"
          onChange={(e) => setLoginPassword(e.target.value)}
        />
        <button onClick={deactivateUser} disabled={!validateForm()}>Deactivate Account</button>
      </div>

      {loginField &&
        loginField === 'success' &&
      <p>Successfully Deactivated Account.</p>}
      {loginField &&
        loginField === 'error' &&
      <p>Invalid password.</p>}

      <Form.Item>
            <Link to="/profile">Back to Profile</Link>
      </Form.Item>
      <Form.Item>
            <Link to="/register">Register</Link>
      </Form.Item>
      <Form.Item>
            <Link to="/login">Log In</Link>
      </Form.Item>
    </div>
  );
}

export default Deactivate;
