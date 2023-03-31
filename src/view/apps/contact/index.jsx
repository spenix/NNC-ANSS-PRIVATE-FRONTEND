import { Route, Switch, Redirect } from "react-router";

import { useSelector } from "react-redux";

import Table from "./Table";
import Detail from "./Detail";

export default function Contact() {
  const selectedUser = useSelector((state) => state.contact.selectedUser);

  return (
    <Switch>
      <Route exact path="/apps/contact">
        <Table />
      </Route>

      {
        !selectedUser ? (
          <Redirect to="/apps/contact" />
        ) : (
          <Route path="/apps/contact/contact-detail/:id">
            <Detail selectedUser={selectedUser} />
          </Route>
        )
      }
    </Switch>
  );
}
