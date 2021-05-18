import React, { useState } from "react";
import { Form } from 'antd';
import Axios from "axios";
import { Link, useHistory } from 'react-router-dom';
import host from '../host-config';

function RegistrationForm() {
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerDisplayName, setRegisterDisplayName] = useState("");
  const [registerHandle, setRegisterHandle] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerField, setRegisterField] = useState('');
  const history = useHistory();
  
  const register = () => {
    Axios({
      method: "POST",
      data: {
        email: registerEmail,
        displayName: registerDisplayName,
        handle: registerHandle,
        password: registerPassword,
      },
      withCredentials: true,
      url: `${host}/register`,
    }).then((res) => {
      console.log(res)
      console.log(res.data)
      if(res.data === "User Created"){
        setRegisterField('success')
        history.push('/login');
      }
      else{
        setRegisterField('already')
      }
    })
    .catch(error => {console.log(error)});
  };

  function hasNumber(str) {
    return /\d/.test(str);
  }

  function hasUpperCase(str) {
    return (/[A-Z]/.test(str));
  }

  function hasLowerCase(str) {
    return (/[a-z]/.test(str));
  }

  function validateForm() {
    return registerEmail.length > 0 && registerDisplayName.length > 0 && registerHandle.length > 0 && registerPassword.length > 7 && hasLowerCase(registerPassword) && hasUpperCase(registerPassword) && hasNumber(registerPassword);
  }

  return (
    <div className="App">
      <div>
        <h1 id="regTitle">Register</h1>
        <p>All fields must be filled out or you will not be able to register.</p>
        <p>Your password must be at least 8 characters, and must include at least one lowercase letter, one uppercase letter, and one number.</p>
        <input
          id="email"
          pattern="/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/"
          placeholder="email"
          onChange={(e) => setRegisterEmail(e.target.value)}
        />
        <input
          id="displayName"
          placeholder="display name"
          onChange={(e) => setRegisterDisplayName(e.target.value)}
        />
        <input
          id="handle"
          placeholder="handle"
          onChange={(e) => setRegisterHandle(e.target.value)}
        />
        <input
          id="password"
          placeholder="password"
          onChange={(e) => setRegisterPassword(e.target.value)}
        />
        <button id="regButton" onClick={register} disabled={!validateForm()}>Register</button>
      </div>

      {registerField &&
        registerField === 'success' &&
      <p>User Successfully Created.</p>}
      {registerField &&
        registerField === 'already' &&
      <p>User Already Exists.</p>}

      <Form.Item>
            <Link to="/login">Already have an account? Log In.</Link>
      </Form.Item>
    </div>
  );
}

export default RegistrationForm;
