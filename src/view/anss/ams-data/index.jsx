import { Route, Switch, Redirect } from "react-router";

import { useSelector } from "react-redux";

import Table from "./Table";
import Detail from "./Details2";

export default function AmsData() {
  const { pageRoles } = useSelector(state => state.auth);
  console.log(pageRoles);
  console.log(...props);
  return (
    <Switch>
      <Route exact path="/data-entry" render={(props) => <Table {...props} pageRoles={pageRoles} />} />
      <Route path="/data-entry/detail/:type/:parameter" render={(props) => <Detail {...props} pageRoles={pageRoles} />} />
    </Switch>
  );
}
