import { Route, Switch } from "react-router";
import { Col, Row } from "antd";
import { useSelector } from "react-redux";
import WorkInProgressImg from "../../../utils/global-components/WorkInProgress";

import Table from "./Table";
import Detail from "./Details";

const Manuals = () => {
  const { pageRoles } = useSelector(state => state.auth);
  return (
    <Switch>
      <Route exact path="/manuals" render={(props) => <Table {...props} pageRoles={pageRoles} />} />
      <Route path="/manuals/forms/:formAction/:id" render={(props) => <Detail {...props} pageRoles={pageRoles} />} />
    </Switch>
  );
}

export default Manuals;
