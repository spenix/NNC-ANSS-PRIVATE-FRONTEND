import { Route, Switch, Redirect } from "react-router";
import { useSelector } from "react-redux";
// import Table from "./Table";
import Detail from "./Details2";
import Detail2 from "./dataEntry/Details";
export default function IndicatorApproval() {
  const { pageRoles } = useSelector(state => state.auth);
  return (
    <Switch>
              <Route exact path="/data-entry" render={(props) => <Detail {...props} pageRoles={pageRoles} />} />
              <Route path={`/data-entry/detail/:key`} render={(props) => <Detail2 {...props} pageRoles={pageRoles} />} />
    </Switch>
  );
}
