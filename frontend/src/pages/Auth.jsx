import React, { useRef, useState, useContext } from "react";
import "./Auth.css";
import AuthContext from "../context/auth-context";
const AuthPage = () => {
  const context = useContext(AuthContext);
  const emailEl = useRef();
  const passwordEl = useRef();
  const submithandler = async event => {
    event.preventDefault();
    const email = emailEl.current.value;
    const password = passwordEl.current.value;
    if (email.trim().length === 0 || password.trim().length === 0) return;
    let requsetBody = {
      query: `
    query Login($email: String!, $password: String!){
      login(email: $email, password: $password){
        token
        userId
        tokenExpriration
      }
    }
    `,
      variables: {
        email,
        password
      }
    };
    if (!isLogin) {
      requsetBody = {
        query: `
        mutation CreateUser($email: String!, $password: String!){
          createUser(userInput:{email:$email,password:$password}){
            _id
            email
          }
        }
        `,
        variables: {
          email,
          password
        }
      };
    }
    try {
      const response = await fetch("http://localhost:8000/graphql", {
        method: "POST",
        body: JSON.stringify(requsetBody),
        headers: { "Content-Type": "application/json" }
      });
      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Failed");
      }
      const returnData = await response.json();
      if (returnData.data.login.token) {
        context.login(
          returnData.data.login.token,
          returnData.data.login.userId,
          returnData.data.login.tokenExpriration
        );
      }
    } catch (error) {
      console.log(error);
    }
  };
  const [isLogin, setIsLogin] = useState(true);

  return (
    <form className="auth-form" onSubmit={submithandler}>
      <h1>The auth page</h1>
      <div className="form-control">
        <label htmlFor="email">Email</label>
        <input type="text" id="email" ref={emailEl} />
      </div>
      <div className="form-control">
        <label htmlFor="password">Password</label>
        <input type="password" id="password" ref={passwordEl} />
      </div>
      <div className="form-actions">
        <button type="submit">Submit</button>
        <button type="button" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Signup" : "Login"}
        </button>
      </div>
    </form>
  );
};

export default AuthPage;
