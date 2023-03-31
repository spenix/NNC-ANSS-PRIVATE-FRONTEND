import { Route, Switch, Redirect } from "react-router";

import { useSelector } from "react-redux";

import Table from "./Table";
import Detail from "./Detail";

export default function Indicators() {
  const indicatorTypes = useSelector((state) => state.indicatorTypes);
  return (
    <Switch>
      <Route exact path="/indicators">
        <Table />
      </Route>
          <Route path="/indicators/detail/:id" component={Detail} />
    </Switch>
  );
}