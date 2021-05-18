import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import host from '../host-config';
import Axios from "axios";

function Logout(props) {
  const history = useHistory();

  useEffect(() => {
    Axios({
      method: "GET",
      withCredentials: true,
      url: host+ "/api/logout",
    }).then((res) => {
        console.log(res.data);
        history.push('/login');
        // return res;
    });
  }, []);

  return (
      <div>
        Logging out
      </div>
  );

}

export default Logout;
