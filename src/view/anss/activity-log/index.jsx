import { Route, Switch } from "react-router";
import { Col, Row } from "antd";
import { useSelector } from "react-redux";

import Table from "./Table";

const ActivityLog = () => {
  const { pageRoles } = useSelector(state => state.auth);
  return (
    <Switch>
      <Route exact path="/activity-log" render={(props) => <Table {...props} pageRoles={pageRoles} />} />
    </Switch>
  );
}

export default ActivityLog;
