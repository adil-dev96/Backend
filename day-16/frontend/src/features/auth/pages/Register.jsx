import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";

const register = () => {
const {loading,handleRegister}= useAuth()

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate()

 const handleSubmit =async (e)=>{
  e.preventDefault()
 await handleRegister(username,email,password)
 navigate('/')
 }
 if(loading){
    return (<main><h1>Loading....</h1></main>)
  }

  if(loading){
    return (<main> <h1>Loading...</h1></main>)
  }

  return (
    <main>
      <div className="form-container">
        <h1>Register</h1>
        <form onSubmit={handleSubmit} >
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
              setEmail(e.target.value);
            }}
            type="text"
            name="email"
            placeholder="Enter Email"
          />
          <input
            onInput={(e) => {
              setPassword(e.target.value);
            }}
            type="password"
            name="password"
            placeholder="Enter password"
          />
          <button>Register</button>
        </form>

        <p>
          Already have an acoount?{" "}
          <Link className="toggleAuthForm" to="/login">
            Login{" "}
          </Link>{" "}
        </p>
      </div>
    </main>
  );
};

export default register;
