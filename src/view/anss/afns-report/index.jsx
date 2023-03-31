import { Route, Switch } from "react-router";
import { useSelector } from "react-redux";

import Table from "./Table";
import Detail from "./Details";

const AfnsReport = () => {
  const { pageRoles } = useSelector(state => state.auth);
  return (
    <Switch>
      <Route exact path="/afns-report"  render={(props) => <Table {...props} pageRoles={pageRoles} />} />
      <Route path="/afns-report/forms/:formAction/:id" render={(props) => <Detail {...props} pageRoles={pageRoles} />}/>
    </Switch>
  );
}
 
export default AfnsReport;