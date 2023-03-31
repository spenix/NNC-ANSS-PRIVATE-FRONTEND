import { Route, Switch } from "react-router";
import { Col, Row } from "antd";
import WorkInProgressImg from "../../../utils/global-components/WorkInProgress";
export default function MainReport() {
  return (
    <Switch>
      <Route exact path="/main-report">
            <Row justify="center">
                <Col span={12}>
                    <WorkInProgressImg />
                </Col>
            </Row>
      </Route>
          {/* <Route path="/indicator-types/detail/:id" component={Detail} /> */}
    </Switch>
  );
}