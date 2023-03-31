import { useState } from "react";
import { Route, Switch, Redirect } from "react-router";

import { useSelector } from "react-redux";

import Table from "./Table";
import Detail from "./Details";

const SocialProtectionProgram = () => {
    const selectedAms = useSelector((state) => state.ams.selectedAms);
  return (
    <Switch>
      <Route exact path="/international-data-sources">
        <Table />
      </Route>
          <Route path="/international-data-sources/forms/:formAction/:id" component={Detail} />
    </Switch>
  );
}
 
export default SocialProtectionProgram;