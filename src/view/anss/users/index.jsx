import { Route, Switch, Redirect } from "react-router";

import { useSelector } from "react-redux";

import UsersList from "./UsersList";
import Detail from "./Detail";

export default function User() {
  const { pageRoles } = useSelector(state => state.auth);

  return (
    <Switch>
      <Route exact path="/users" 
        render={(props) => <UsersList {...props} pageRoles={pageRoles} />}
      />
        
      <Route path="/users/user-detail/:id" 
        render={(props) => <Detail {...props} pageRoles={pageRoles} />}
      />
    </Switch>
  );
}
