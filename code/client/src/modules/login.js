
import Axios from "axios";

async function login(loginEmail, loginPassword) {
    Axios({
      method: "POST",
      data: {
        email: loginEmail,
        password: loginPassword,
      },
      withCredentials: true,
      url: "http://localhost:5000/login",
    }).then((res) => {
        console.log('login', res);
        return res;
    })  
    .catch(error => {console.log(error.response)});;
};

async function getUser() {
    Axios({
      method: "GET",
      withCredentials: true,
      url: "http://localhost:5000/user",
    }).then((res) => {
        console.log(res.data);
        return res;
    });
};

/* function loginHandler(){
    login(loginEmail, loginPassword)
      .then(function (response) {
        console.log(response.data);
        // I need this data here ^^
        return response.data;
      })
      .catch(function (error) {
          console.log(error);
      });


    /* login(loginEmail, loginPassword).then(result => {
      console.log('Logged In Successfully');
      console.log(result);
      getUser().then(res => {
        console.log(res);
      });
    }); 
  } */

export { login, getUser };
