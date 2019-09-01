import React, { useContext } from "react";
import AuthContext from "../Auth-Context";
const Profile = () => {
  const context = useContext(AuthContext);
  return (
    <React.Fragment>
      <div>My profile page.</div>
      <h1>{context.user.username}</h1>
      <p>{context.user.createdAt} </p>
    </React.Fragment>
  );
};

export default Profile;
