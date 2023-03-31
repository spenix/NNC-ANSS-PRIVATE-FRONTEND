import { Route, Switch } from "react-router";

import { useSelector } from "react-redux";

import Table from "./Table";
import Detail from "./Details";

const PoliciesAndProgrammes = () => {
  const { pageRoles } = useSelector(state => state.auth);
  return (
    <Switch>
      <Route exact path="/policies-and-programmes" render={(props) => <Table {...props} pageRoles={pageRoles} />} />
      <Route path="/policies-and-programmes/forms/:formAction/:id" render={(props) => <Detail {...props} pageRoles={pageRoles} />} />
    </Switch>
  );
}
 
export default PoliciesAndProgrammes;