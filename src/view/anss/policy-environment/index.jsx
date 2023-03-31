import { Route, Switch } from "react-router";
import { useSelector } from "react-redux";
import Table from "./Table";
import Detail from "./Details";

const PolicyEnvironment = () => {
    const { pageRoles } = useSelector(state => state.auth);
  return (
    <Switch>
      <Route exact path="/policy-environment"
      render={(props) => <Table {...props} pageRoles={pageRoles} />}
      />
      <Route path="/policy-environment/forms/:formAction/:id" 
        render={(props) => <Detail {...props} pageRoles={pageRoles} />}
      />
    </Switch>
  );
}
 
export default PolicyEnvironment;