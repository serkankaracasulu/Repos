import React, { useContext, useEffect } from "react";
import { NavLink } from "react-router-dom";
import AuthContext from "./Auth-Context";
import Logout from "./pages/Logut";

const Header = ({ user }) => {
  const context = useContext(AuthContext);
  console.log(context.user);
  useEffect(() => {}, [user]);
  return (
    <div className="header">
      <div className="logo">
        <h2 className="logo__title">easysnap</h2>
      </div>
      <div className="header_menu">
        <NavLink exact to="/">
          Snaps
        </NavLink>
        {context.user && context.user.username ? (
          <React.Fragment>
            <NavLink to="/profile">{context.user.username}</NavLink>
            <Logout />
          </React.Fragment>
        ) : (
          <React.Fragment>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/join">Join</NavLink>
          </React.Fragment>
        )}
      </div>
    </div>
  );
};

export default Header;
