import { Route, Switch } from "react-router";

import { useSelector } from "react-redux";

import Table from "./Table";
import Detail from "./Details";

const PolicyStatuses = () => {
    const { pageRoles } = useSelector(state => state.auth);
  return (
    <Switch>
      <Route exact path="/policy-statuses" 
      render={(props) => <Table {...props} pageRoles={pageRoles} />}
      />
      <Route path="/policy-statuses/forms/:formAction/:id"  render={(props) => <Detail {...props} pageRoles={pageRoles} />} />
    </Switch>
  );
}
 
export default PolicyStatuses;