import React from "react";

export default React.createContext({
  setNewToken: loguser => {},
  setNewUser: user => {},
  token: null,
  user: {}
});
