import { Route, Switch, Redirect} from "react-router";
import { Row, Col } from "antd";
import WorkInProgressImg from "../../../utils/global-components/WorkInProgress";
import UserTemplate from "./userTemplate"


const UserManual = () => {

  return (
      <Switch>
        <Route exact path="/indicator-data-template" render={(props) => <UserTemplate {...props}  />}/>
            
      </Switch>
  );
}
 
export default UserManual;
