import React, { useContext, useState, useEffect } from "react";
import TimeAgo from "react-timeago";
import { GET_SNAPS } from "../../../queries";
import { useQuery, useMutation } from "@apollo/react-hooks";
import AuthContext from "../../Auth-Context";
import { CREATE_SNAP, SNAP_CREATED } from "../../../queries";
import Input from "../../form/input";
import JoinedUs from "../JoinedUs";
import { networkInterfaces } from "os";
const Home = () => {
  const context = useContext(AuthContext);
  const [createSnap] = useMutation(CREATE_SNAP);
  const { data, loading, error, subscribeToMore } = useQuery(GET_SNAPS);
  const [values, setValues] = useState({
    text: "",
    user_id: ""
  });

  const handleOnChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };
  const updateCache = (cache, { data: { createSnap } }) => {
    const { snaps } = cache.readQuery({
      query: GET_SNAPS
    });
    cache.writeQuery({
      query: GET_SNAPS,
      data: {
        snaps: [createSnap, ...snaps]
      }
    });
  };

  if (loading) return "Loading.";
  if (error) return "Error.";

  subscribeToMore({
    document: SNAP_CREATED,
    updateQuery: (prev, { subscriptionData }) => {
      if (!subscriptionData.data) return prev;
      const newItem = subscriptionData.data.snap;
      if (
        context.user.id !== newItem.user.id &&
        !prev.snaps.find(snap => snap.id === newItem.id)
      ) {
        return {
          ...prev,
          snaps: [newItem, ...prev.snaps]
        };
      } else {
        return prev;
      }
    }
  });
  const handleOnSubmit = e => {
    e.preventDefault();
    setValues({
      text: "",
      user_id: ""
    });
    createSnap({
      variables: { text: values.text, user_id: context.user.id },
      update: updateCache,
      optimisticResponse: {
        __typename: "Mutation",
        createSnap: {
          __typename: "Snap",
          id: Math.round(Math.random() * -20000),
          text: values.text,
          createdAt: new Date(),
          user: {
            __typename: "User",
            ...context.user
          }
        }
      }
    });
  };
  return (
    <React.Fragment>
      <div className="description">
        <p className="sub_header__desc">
          simple snap app with <span>react</span>.
        </p>
      </div>
      <div>
        <form onSubmit={handleOnSubmit}>
          <Input
            className="add-snap__input"
            isDisabled={!context.user}
            placeholder={context.user ? "add snap" : "Please login"}
            name="text"
            value={values.text}
            onChange={handleOnChange("text")}
          />
        </form>
      </div>
      <JoinedUs />
      <div>
        <ul className="snaps">
          {data.snaps.map(snap => {
            return (
              <li key={snap.id} className={snap.id < 0 ? "optimistic" : ""}>
                <span className="username">@{snap.user.username}</span>
                <div className="title">{snap.text}</div>
                <div className="date">
                  <span>
                    {snap.id < 0 ? (
                      "sending"
                    ) : (
                      <TimeAgo date={snap.createdAt} />
                    )}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="counter">{data.snaps.length} snap(s)</div>
    </React.Fragment>
  );
};

export default Home;
