import React, { useState } from "react";
import { Form } from 'antd';
import Axios from "axios";
import { Link } from 'react-router-dom';
import host from '../host-config';

function ChangePassword(props) {
  
  const [loginEmail, setLoginEmail] = useState("");
  const [OldPassword, setOldPassword] = useState("");
  const [NewPassword, setNewPassword] = useState("");
  const [loginField, setLoginField] = useState('');
  
  const changePass = () => {
    Axios({
      method: "POST",
      data: {
        email: loginEmail,
        password: OldPassword,
        newPassword: NewPassword,
      },
      withCredentials: true,
      url: `${host}/changePassword`,
    }).then((res) => {
      console.log(res);
      console.log(res.data.userObj);
      if(res.data === "Incorrect Credentials."){
        setLoginField('error')
      }
      else{
        setLoginField('success')
      }
    })
    .catch(error => {console.log(error.response)});;
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
    return loginEmail.length > 0 && OldPassword.length > 0 && NewPassword.length > 7 && hasLowerCase(NewPassword) && hasUpperCase(NewPassword) && hasNumber(NewPassword);;
  }

  return (
    <div className="App">
      <div>
        <h1>Change Password</h1>
        <p>New password must be at least 8 characters, and must include at least one lowercase letter, one uppercase letter, and one number.</p>
        <input
          placeholder="email"
          onChange={(e) => setLoginEmail(e.target.value)}
        />
        <input
          placeholder="old password"
          onChange={(e) => setOldPassword(e.target.value)}
        />
        <input
          placeholder="new password"
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button onClick={changePass} disabled={!validateForm()}>Change Password</button>
      </div>

      {loginField &&
        loginField === 'success' &&
      <p>Successfully Changed Password.</p>}
      {loginField &&
        loginField === 'error' &&
      <p>Invalid password.</p>}

      <Form.Item>
            <Link to="/profile">Back to Profile</Link>
      </Form.Item>
    </div>
  );
}

export default ChangePassword;
