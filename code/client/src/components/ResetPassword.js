import React, { useState } from "react";
import { Form } from 'antd';
import Axios from "axios";
import { Link } from 'react-router-dom';
import host from '../host-config';

function ResetPassword(props) {
  
  const [resetEmail, setResetEmail] = useState("");

  const reset = () => {
    Axios({
      method: "POST",
      data: {
        email: resetEmail,
      },
      withCredentials: true,
      url: `${host}/resetPassword`,
    }).then((res) => console.log(res))
    .catch(error => {console.log(error.response)});;
  };

  function validateForm() {
    return resetEmail.length > 0;
  }

  return (
    <div className="App">
      <div>
        <h1>Reset Password</h1>
        <input
          placeholder="email"
          onChange={(e) => setResetEmail(e.target.value)}
        />
        <button onClick={reset} disabled={!validateForm()}>Reset</button>
      </div>

      <Form.Item>
            <Link to="/login">Back to Login</Link>
      </Form.Item>
    </div>
  );
}

export default ResetPassword;
