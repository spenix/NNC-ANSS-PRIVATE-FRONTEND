import { Route, Switch, Redirect } from "react-router";

import { useSelector } from "react-redux";

import Table from "./Table";
import Detail from "./Detail";

export default function IndicatorCategories() {
  const { pageRoles } = useSelector(state => state.auth);
  return (
    <Switch>
      <Route exact path="/indicators" render={(props) => <Table {...props} pageRoles={pageRoles} />}/>
      <Route path="/indicators/forms/:formAction/:id" render={(props) => <Detail {...props} pageRoles={pageRoles} />} />
    </Switch>
  );
}