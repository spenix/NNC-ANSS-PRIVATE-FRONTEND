import { Route, Switch } from "react-router";
import { useSelector } from "react-redux";

import Table from "./Table";
import Detail from "./Details";

const SocialProtectionProgram = () => {
  const { pageRoles } = useSelector(state => state.auth);
  return (
    <Switch>
      <Route exact path="/national-data-sources" 
        render={(props) => <Table {...props} pageRoles={pageRoles} />}
      />
      <Route path="/national-data-sources/forms/:formAction/:id" 
          render={(props) => <Detail {...props} pageRoles={pageRoles} />}
      />
    </Switch>
  );
}
 
export default SocialProtectionProgram;