import { useState } from "react";
import { Route, Switch, Redirect } from "react-router";

import { useSelector } from "react-redux";

import Table from "./Table";

const SocialProtectionProgram = () => {
    const selectedAms = useSelector((state) => state.ams.selectedAms);
  return (
    <Switch>
      <Route exact path="/indicator-data-types">
        <Table />
      </Route>
    </Switch>
  );
}
 
export default SocialProtectionProgram;