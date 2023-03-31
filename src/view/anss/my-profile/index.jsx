import React, { useState, useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import { Row, Col, Drawer, Button, Dropdown, Menu } from "antd";
import { RiMore2Line, RiMenuFill, RiCloseFill } from "react-icons/ri";
import Breadcrumbs from "../../../layout/components/content/breadcrumbs";
import InfoProfile from "./personel-information";
import MenuProfile from "./menu";
import PasswordProfile from "./password-change";

// redux
import { useDispatch, useSelector } from 'react-redux';

import { getMyProfileDetails } from "../../../redux/users/usersActions";
export default function Profile() {
  const [visible, setVisible] = useState(false);

  const { myprofile  } = useSelector(state => state.users);

  // Redux
  const dispatch = useDispatch();


  useEffect(() => {
    handleFetchProfileDetails()
	}, []);


  const handleFetchProfileDetails = () => {
    dispatch(getMyProfileDetails());
  }

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  const rateMenu = (
    <Menu>
      <Menu.Item key="0">Change Avatar</Menu.Item>
    </Menu>
  );

  function moreBtn() {
    // return (
    //   <Dropdown overlay={rateMenu} placement="bottomLeft">
    //     <Button
    //       type="text"
    //       icon={<RiMore2Line className="hp-text-color-black-100 hp-text-color-dark-0" size={24} />}
    //     ></Button>
    //   </Dropdown>
    // );
  }

  return (
    <Row gutter={[32, 32]} className="hp-mb-32">
      <Drawer
        title={moreBtn()}
        className="hp-profile-mobile-menu"
        placement="left"
        closable={true}
        onClose={onClose}
        visible={visible}
        closeIcon={
          <RiCloseFill
            className="remix-icon hp-text-color-black-80"
            size={24}
          />
        }
      >
        <MenuProfile
          onCloseDrawer={onClose}
          moreBtnCheck="none"
          footer="none"
        />
      </Drawer>

      <Col span={24}>
        <Row gutter={[32, 32]} justify="space-between">
          <Breadcrumbs breadCrumbActive="Profile" />
        </Row>
      </Col>

      <Col span={24}>
        <Row className="hp-profile-mobile-menu-btn hp-bg-color-black-0 hp-bg-color-dark-100 hp-border-radius hp-py-12 hp-px-sm-8 hp-px-24 hp-mb-16">
          <Button
            className="hp-p-0"
            type="text"
            icon={
              <RiMenuFill
                size={24}
                className="remix-icon hp-text-color-black-80 hp-text-color-dark-30"
              />
            }
            onClick={showDrawer}
          ></Button>
        </Row>

        <Row className="hp-bg-color-black-0 hp-bg-color-dark-100 hp-border-radius hp-pr-sm-16 hp-pr-32">
          <MenuProfile
            moreBtn={moreBtn}
            myprofile={myprofile}/>
          <Col
            flex="1 1"
            className="hp-pl-sm-16 hp-pl-32 hp-py-sm-24 hp-py-32 hp-pb-24 hp-overflow-hidden"
          >
            <Switch>
              <Route path="/my-profile/personel-information" exact>
                <InfoProfile myprofile={myprofile} handleFetchProfileDetails={handleFetchProfileDetails}/>
              </Route>

              <Route path="/my-profile/password-change">
                <PasswordProfile />
              </Route>

            </Switch>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}