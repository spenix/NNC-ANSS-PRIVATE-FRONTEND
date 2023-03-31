import React, { Route, Switch } from "react-router";
import { useSelector } from "react-redux";
import {  useHistory } from "react-router-dom";
import HomePage from "./HomePage";

export default function index() {
  const history = useHistory();
  const { isLoggedIn, pageRoles } = useSelector(state => state.auth);
  if(!isLoggedIn) {
    history.push("/login");
  }
  return (
    <Switch>
        <Route exact path="/dashboard" render={(props) => <HomePage {...props} pageRoles={pageRoles} />} />
        <Route exact path="/" render={(props) => <HomePage {...props} pageRoles={pageRoles} />}/>
    </Switch>
  );
}