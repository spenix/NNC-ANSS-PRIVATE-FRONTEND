import { useState } from "react";
import { Route, Switch, Redirect } from "react-router";

import { useSelector } from "react-redux";

import Table from "./Table";
import Detail from "./Details";

const SocialProtectionProgram = () => {
    const selectedAms = useSelector((state) => state.ams.selectedAms);
  return (
    <Switch>
      <Route exact path="/collection-periods">
        <Table />
      </Route>
          <Route path="/collection-periods/forms/:formAction/:id" component={Detail} />
    </Switch>
  );
}
 
export default SocialProtectionProgram;