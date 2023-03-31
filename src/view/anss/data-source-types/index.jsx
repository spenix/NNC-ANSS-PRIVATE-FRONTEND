import { Route, Switch } from "react-router";
import { useSelector } from "react-redux";
import Table from "./Table";
import Detail from "./Details";

const DataSourceTypes = () => {
  const { pageRoles } = useSelector(state => state.auth);
  return (
    <Switch>
      <Route exact path="/data-source-types" 
      render={(props) => <Table {...props} pageRoles={pageRoles} />}
      />
      <Route path="/data-source-types/forms/:formAction/:id" render={(props) => <Detail {...props} pageRoles={pageRoles} />}/>
    </Switch>
  );
}
 
export default DataSourceTypes;