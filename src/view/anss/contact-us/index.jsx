import { Route, Switch } from "react-router";
import { Col, Row } from "antd";
import { useSelector } from "react-redux";

import Table from "./Table";

const ContactUs = () => {
  const { pageRoles } = useSelector(state => state.auth);
  return (
    <Switch>
      <Route exact path="/contact-us" render={(props) => <Table {...props} pageRoles={pageRoles} />} />
    </Switch>
  );
}

export default ContactUs;
