import React, { useState, useEffect } from "react";
import Input from "../form/input";
import { useMutation } from "@apollo/react-hooks";
import { CREATE_USER } from "../../queries";
import Error from "./../Error";
const Join = props => {
  const [values, setValues] = useState({
    username: "",
    password: "",
    passwordConfirm: ""
  });
  const [createUser, { loading, error, data }] = useMutation(CREATE_USER);
  const handleChance = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };
  useEffect(() => {
    if (data && data.createUser && data.createUser.token) {
      const token = data.createUser.token;
      localStorage.setItem("token", token);
      props.history.push("/");
    }
  }, [data, props.history]);
  const onSubmit = e => {
    e.preventDefault();
    createUser({
      variables: { username: values.username, password: values.password }
    });
    setValues({
      username: "",
      password: "",
      passwordConfirm: ""
    });
  };
  return (
    <div>
      <form className="user-form" onSubmit={e => onSubmit(e)}>
        <Input
          name="username"
          value={values.username}
          onChange={handleChance("username")}
        />
        <Input
          name="password"
          onChange={handleChance("password")}
          value={values.password}
        />
        <Input
          name="passwordConfirm"
          onChange={handleChance("passwordConfirm")}
          value={values.passwordConfirm}
        />
        <label>
          <button>Join</button>
        </label>
      </form>
      {loading && <p>Loading..</p>}
      {error && <Error error={error.message} />}
    </div>
  );
};

export default Join;
