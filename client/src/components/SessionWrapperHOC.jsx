import React, { useEffect, useContext } from "react";
import { GET_ACTIVE_USER } from "../queries/index";
import { useQuery } from "@apollo/react-hooks";
import AuthContext from "./Auth-Context";
const SessionWrapperHOC = ({ token, reLoad }) => {
  const context = useContext(AuthContext);
  const { loading, error, data, refetch } = useQuery(GET_ACTIVE_USER);
  // const client = useApolloClient();
  useEffect(() => {
    console.log("Start refetching...");
    if (token) {
      refetch();
      context.setNewUser(data.activeUser);
      console.log("Done refetching...");
    }
  }, [token, refetch, context, data]);
  //
  if (loading) return "Looading...";
  if (error) return `${error.message}`;
  context.setNewUser(data.activeUser);
  return <div>oldu</div>;
};

export default SessionWrapperHOC;
