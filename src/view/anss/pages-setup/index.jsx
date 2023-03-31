import { Route, Switch } from "react-router";

import { useSelector } from "react-redux";

import Table from "./Table";
import Detail from "./Details2";

export default function PageSetup() {
  const { pageRoles } = useSelector(state => state.auth);
  return (
    <Switch>
      <Route exact path="/pages-setup" render={(props) => <Table {...props} pageRoles={pageRoles} />} />
      <Route path="/pages-setup/forms/:formAction/:id" component={Detail}  render={(props) => <Detail {...props} pageRoles={pageRoles} />}/>
    </Switch>
  );
}