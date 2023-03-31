import { Route, Switch, Redirect } from "react-router";

import { useSelector } from "react-redux";

import Table from "./Table";
import Detail from "./Detail";

export default function IndicatorCategories() {
  const { pageRoles } = useSelector(state => state.auth);
  return (
    <Switch>
      <Route exact path="/indicator-types" render={(props) => <Table {...props} pageRoles={pageRoles} />}/>
      <Route path="/indicator-types/forms/:formAction/:id" render={(props) => <Detail {...props} pageRoles={pageRoles} />} />
    </Switch>
  );
}