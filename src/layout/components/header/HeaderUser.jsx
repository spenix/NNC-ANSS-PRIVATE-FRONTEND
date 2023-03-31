import { Link } from "react-router-dom";

import { Dropdown, Col, Avatar, Divider, Row, Modal } from "antd";
import { Calendar, Game, People, User} from "react-iconly";
import { RiInformationLine } from "react-icons/ri";

import avatarImg from "../../../assets/images/memoji/memoji-1.png";

import { useDispatch, useSelector } from "react-redux";

// redux 
import {logout} from "../../../redux/auth/authActions"

export default function HeaderUser() {

  const dispatch = useDispatch();

  const { confirm } = Modal;

  const confirmLogout = () => {

    confirm({
      title: (
        <h5 className="hp-mb-0 hp-font-weight-500">
          Are you sure you want to log out?
        </h5>
      ),
      icon: (
        <span className="remix-icon">
          <RiInformationLine />
        </span>
      ),
      content: (
        <p className="hp-p1-body hp-text-color-black-80">You will be redirected to the login screeen.</p>
      ),
      okText: "Log Out",
      onOk() {
        dasboardLogout();
      },
      onCancel() {},
    });
  }

  const dasboardLogout = () => {
    dispatch(logout());
  }
 
  const menu = (
    <div className="hp-border-radius hp-border-1 hp-border-color-black-40 hp-bg-black-0 hp-bg-dark-100 hp-border-color-dark-80 hp-p-24 hp-mt-12" style={{ width: 260 }}>
      <span className="hp-d-block h5 hp-text-color-black-100 hp-text-color-dark-0 hp-mb-8">Profile Settings</span>

      <Link
        // to="/pages/profile/personel-information"
        to="/my-profile/personel-information"
        className="hp-p1-body hp-text-color-primary-1 hp-text-color-dark-primary-2 hp-hover-text-color-primary-2"
      >
        View Profile
      </Link>

      <Divider className="hp-mb-16 hp-mt-6" />

      <a onClick={confirmLogout} className="hp-p1-body">
        Logout
      </a>
    </div>
  );

  return (
    <Col>
      <Dropdown overlay={menu} placement="bottomLeft">
        <Avatar src={<User className="remix-icon" />} size={40} className="hp-cursor-pointer" style={{ backgroundColor:"#ebfafa" }} />
      </Dropdown>
    </Col>
  );
};
