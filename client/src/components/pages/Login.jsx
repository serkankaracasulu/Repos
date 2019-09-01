import React, { useState, useEffect, useContext } from "react";
import Input from "../form/input";
import { useMutation } from "@apollo/react-hooks";
import { SIGIN_USER } from "../../queries";
import Error from "./../Error";
import AuthContext from "../Auth-Context";

const Login = props => {
  const context = useContext(AuthContext);
  const [values, setValues] = useState({
    username: "",
    password: ""
  });
  const [createUser, { loading, error, data }] = useMutation(SIGIN_USER);
  const handleChance = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };
  useEffect(() => {
    if (data && data.signIn && data.signIn.token) {
      const token = data.signIn.token;
      localStorage.setItem("token", token);
      context.setNewToken(token);
      props.history.push("/");
    }
  }, [data, props.history, context]);
  const onSubmit = e => {
    e.preventDefault();
    createUser({
      variables: { username: values.username, password: values.password }
    });
    setValues({
      username: "",
      password: ""
    });
  };
  return (
    <div>
      <form className="user-form" onSubmit={e => onSubmit(e)}>
        <Input
          name="username"
          value={values.username}
          onChange={handleChance("username")}
          id={context.user}
        />
        <Input
          name="password"
          onChange={handleChance("password")}
          value={values.password}
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

export default Login;
