import { useSelector, useDispatch } from 'react-redux';

import React, { useEffect, useState } from "react";

import jwtDecode from 'jwt-decode'

import { ConfigProvider, notification } from 'antd';

import Router from "./router/Router";
import Pusher from "pusher-js";
// import AuthVerify from './auth/authVerify';

import { logout } from "./redux/auth/authActions";
import aseanLogo from "./assets/images/anss-image/asean-logo.png";
import {  useHistory, useLocation } from "react-router-dom";
import { getMyProfileDetails, getCountryDetails } from "./redux/users/usersActions";
import { getNotifList } from "./redux/auth/authActions";

export default function App() {
  const [notifObj, setNotifObj] = useState({});
  const dispatch = useDispatch();
  const location = useLocation();
  const customise = useSelector(state => state.customise);
  const {userNotifs, isLoggedIn} = useSelector(state => state.auth);
  const { myprofile } = useSelector((state) => state.users);
  const history = useHistory();
  const [activatePusher, setActivatePusher] = useState(false);
  const { pathname } = location;

  const [ user, setUser ] = useState(JSON.parse(localStorage.getItem('user')));

  const openNotification = (msg) => {
    notification.info({
      message: `${msg?.entity} has been ${msg?.status} by ${msg?.from?.name} from ${msg?.from?.country}`,
      placement:'bottomLeft',
    });
  };
  
  function showNotification(msg) {
    const notification = new Notification("Notification!", {
       body: `${msg?.entity} has been ${msg?.status} by ${msg?.from?.name} from ${msg?.from?.country}`,
       icon: aseanLogo
    })
 }


 
  useEffect(() => {
    const token = user?.token;
    if(pathname != '/login' && Object.keys(myprofile).length > 0 && typeof token != "undefined"){
      const {organization} = myprofile;
      Pusher.logToConsole = true;
      var pusher = new Pusher('be92349285a653103882', { cluster: 'ap1'}); //pusher key
      var pusherChannel = pusher.subscribe(`country-channel-${organization?.party_id}`);
      pusherChannel.bind('nnc.anss.server', function(message) { // event name
        if(Object.keys(message).length){
          setNotifObj(message);
          openNotification(message);
          if (Notification.permission === "granted") {
            showNotification(message);
          } else if (Notification.permission !== "denied") {
             Notification.requestPermission().then(permission => {
                //console.log(permission);
             });
          }
        }
      });
      return (() => {
        pusher.unsubscribe(`country-channel-${organization?.party_id}`)
      })
      
    }
  }, [dispatch, myprofile])
  
  useEffect(() => {
    dispatch(getMyProfileDetails());
    // setActivatePusher(true);
  }, [isLoggedIn])

  useEffect(() => {
    var notifArr =  userNotifs;
   
    if(Object.keys(notifObj).length){
      notifArr.push(notifObj);
      dispatch({
        type: 'SET_USER_NOTIFICATION',
        data: notifArr
      })
    }

    dispatch(getNotifList());
  }, [notifObj])

  useEffect(()=>{
      const token = user?.token;
      //JWT check if token expired
      // this code is to check if the token is already expired or not.
      if(token){
          const decodedToken = jwtDecode(token)
          if(decodedToken.exp*1000 < new Date().getTime()) {
            dispatch(logout());
            history.push("/login");
          }
      }
      setUser(JSON.parse(localStorage.getItem('user')))
  },[location])


  return (
    <ConfigProvider direction={customise.direction}>
      <Router />
    </ConfigProvider>
  );
}