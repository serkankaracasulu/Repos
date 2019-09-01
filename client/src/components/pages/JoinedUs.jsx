import React from "react";
import { useSubscription } from "@apollo/react-hooks";
import { USER_CREATED } from "../../queries";

const JoinedUs = () => {
  const { data, loading } = useSubscription(USER_CREATED);
  if (loading) return "loading";
  return (
    <div className="joinedus">
      <strong>{data.user.username} is joined to us.</strong>
    </div>
  );
};

export default JoinedUs;
