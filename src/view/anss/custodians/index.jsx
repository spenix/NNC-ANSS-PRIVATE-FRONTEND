import { useSelector } from "react-redux";
import { Route, Switch, Redirect } from "react-router";
import Table from "./Table";
import Detail from "./Details";

const SocialProtectionProgram = () => {
  const { pageRoles } = useSelector(state => state.auth);
  return (
    <Switch>
      <Route exact path="/international-custodians" 
        render={(props) => <Table {...props} pageRoles={pageRoles} />}
/>
      <Route path="/international-custodians/forms/:formAction/:id" render={(props) => <Detail {...props} pageRoles={pageRoles} />}/>
    </Switch>
  );
}
 
export default SocialProtectionProgram;