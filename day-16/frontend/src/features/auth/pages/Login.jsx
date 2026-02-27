import React, { useState } from "react";
import "../style/form.scss";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";


const login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const {handleLogin,loading} = useAuth()
const navigate = useNavigate()

  if(loading){
    return (
      <h1>
        Loading...
      </h1>
    )
  }

  function handleSubmit(e) {
    e.preventDefault();

   handleLogin(username,password).then(res=>{
    console.log(res)
    navigate('/');
   })
  }

  return (
    <main>
      <div className="form-container">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <input
            onInput={(e) => {
              setUsername(e.target.value);
            }}
            type="text"
            name="username"
            placeholder="Enter Username"
          />
          <input
            onInput={(e) => {
              setPassword(e.target.value);
            }}
            type="password"
            name="password"
            placeholder="Enter Password"
          />
          <button>Login</button>
        </form>
        <p>
          Don't have an acoount?{" "}
          <Link className="toggleAuthForm" to="/Register">
            Register{" "}
          </Link>{" "}
        </p>
      </div>
    </main>
  );
};

export default login;
