import { Route, Switch } from "react-router";

import { useSelector } from "react-redux";

import Table from "./Table";
import Detail from "./Details";

const SocialProtectionProgram = () => {
  const { pageRoles } = useSelector(state => state.auth);
  return (
    <Switch>
      <Route exact path="/social-protection-program" render={(props) => <Table {...props} pageRoles={pageRoles} />}/>
      <Route path="/social-protection-program/forms/:formAction/:id" render={(props) => <Detail {...props} pageRoles={pageRoles} />} />
    </Switch>
  );
}
 
export default SocialProtectionProgram;