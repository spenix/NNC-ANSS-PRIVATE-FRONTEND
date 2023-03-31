import { Route, Switch } from "react-router";
import React from "react"
import { useSelector } from "react-redux";

import Table from "./Table";
import Detail from "./Details";

const SocialProtectionProgram = () => {
  const { pageRoles } = useSelector(state => state.auth);
  return (
    <Switch>
      <React.StrictMode>
        <Route exact path="/international-data-sources" render={(props) => <Table {...props} pageRoles={pageRoles} />} />
        <Route path="/international-data-sources/forms/:formAction/:id" render={(props) => <Detail {...props} pageRoles={pageRoles} />} />
      </React.StrictMode>
    </Switch>
  );
}
 
export default SocialProtectionProgram;