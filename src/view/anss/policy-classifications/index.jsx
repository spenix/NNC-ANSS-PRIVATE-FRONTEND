import { Route, Switch } from "react-router";
import { useSelector } from "react-redux";
import Table from "./Table";
import Detail from "./Details";
const PolicyClassification = () => {
  const { pageRoles } = useSelector(state => state.auth);
  return (
    <Switch>
      <Route exact path="/policy-classifications" 
        render={(props) => <Table {...props} pageRoles={pageRoles} />}
      />
          <Route path="/policy-classifications/forms/:formAction/:id" 
             render={(props) => <Detail {...props} pageRoles={pageRoles} />}
          />
    </Switch>
  );
}
 
export default PolicyClassification;