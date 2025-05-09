import React, {useEffect} from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getMyProfileDetails, getCountryDetails } from "../../../../redux/users/usersActions";
import {
  Divider,
  Avatar,
  Row,
  Col,
} from "antd";
import { User} from "react-iconly";
export default function MenuFooter(props) {
  const dispatch = useDispatch();
  const { myprofile, countryDetail } = useSelector((state) => state.users);
  useEffect(() => {
    dispatch(getMyProfileDetails());
  },[]);

  useEffect(() => {
    if(Object.keys(myprofile).length){
        dispatch(getCountryDetails(myprofile?.organization?.name));
    }
  },[myprofile]);
  return (
    props.collapsed === false ? (
      <Row
        className="hp-sidebar-footer hp-pb-24 hp-px-24 hp-bg-color-dark-100"
        align="middle"
        justify="space-between"
      >
        <Divider className="hp-border-color-black-20 hp-border-color-dark-70 hp-mt-0" />

        <Col>
          <Row align="middle">
            {/* <Avatar size={36} src={avatar} className="hp-mr-8" /> */}
            <Avatar src={<User className="remix-icon" />} size={26} className="hp-cursor-pointer hp-mr-8" style={{ backgroundColor:"#ebfafa" }} />
            <div>
              <span className="hp-d-block hp-text-color-black-100 hp-text-color-dark-0 hp-p1-body">
                { myprofile?.complete_name ?? "N/A" }             
              </span>

             
            </div>
          </Row>
        </Col>

        {/* <Col>
          <Link
            to="/pages/profile/security"
            onClick={props.onClose}
          >
            <RiSettings3Line
              className="remix-icon hp-text-color-black-100 hp-text-color-dark-0"
              size={24}
            />
          </Link>
        </Col> */}
      </Row>
    ) : (
      <Row
        className="hp-sidebar-footer hp-pt-16 hp-mb-16 hp-bg-color-dark-100"
        align="middle"
        justify="center"
      >
        <Col>
          <Link
            to="/pages/profile/personel-information"
            onClick={props.onClose}
          >
             <Avatar src={<User className="remix-icon" />} size={36} className="hp-cursor-pointer" style={{ backgroundColor:"#ebfafa" }} />
          </Link>
        </Col>
      </Row>
    )
  );
};