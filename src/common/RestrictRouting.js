import React from "react";
import { Route, Redirect } from "react-router-dom";

//Restricting Routing of pages where even if url is edited to /home or /profile without login
const RestrictRouting = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props =>
        sessionStorage.getItem("access-token") !== null ? (
          <Component {...props} {...rest} />
        ) : (
          <Redirect to={{ pathname: "/", state: { from: props.location } }} />
        )
      }
    />
  );
};

export default RestrictRouting;
