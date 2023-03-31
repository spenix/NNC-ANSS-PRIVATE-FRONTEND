import { Route, Switch, Redirect} from "react-router";
import { useState, useEffect } from "react";
import { getLatestManual } from "../../../redux/userManual/userManualActions";
import { useDispatch, useSelector } from "react-redux";
import {successMsg, errorMsg, warningMsg, infoMsg, callNotif} from '../../../utils/global-functions/minor-functions';
import { Row } from "antd";
import UserManualView from './UserManual';


const UserManual = () => {
  const dispatch = useDispatch();
  const { userManual_data: {attributes, id} } = useSelector((state) => state.userManual);
  const getUserManualData = () => {
      dispatch(getLatestManual()).catch((e) => {
        infoMsg("No document found...")
      });
  }
  useEffect(() => {getUserManualData()}, [])
  return (
      <Switch>
        <Route exact path="/user-manual" render={(props) => <UserManualView attributes={typeof attributes == "undefined" ? {description: "", document_url: ""} : attributes}/>}/>
      </Switch>
  );
}
 
export default UserManual;
