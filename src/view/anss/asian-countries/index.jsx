import { useState } from "react";
import { Route, Switch, Redirect } from "react-router";

import { useSelector } from "react-redux";

import Table from "./Table";
import Detail from "./Details";

const SocialProtectionProgram = () => {
      const { pageRoles } = useSelector(state => state.auth);
  return (
    <Switch>
      <Route exact path="/countries"
        render={(props) => <Table {...props} pageRoles={pageRoles} />}
      />
       
      <Route path="/countries/forms/:formAction/:id" 
        render={(props) => <Detail {...props} pageRoles={pageRoles} />}
       />
    </Switch>
  );
}
 
export default SocialProtectionProgram;