import React, {useState, useEffect} from "react";
import { useSelector, useDispatch } from "react-redux";

import { Button, Badge, Row, Col, Dropdown, Divider, Avatar } from "antd";
import { Notification, TickSquare, CloseSquare, Danger } from "react-iconly";
import {RiBellLine, RiInboxLine} from "react-icons/ri";
import { clearAllNotif } from "./../../../redux/auth/authActions";

import moment from "moment-timezone";

import avatarImg from "../../../assets/images/memoji/memoji-5.png";

export default function HeaderNotifications() {
  const [notifList, setNotifList] = useState([]);

  const dispatch = useDispatch();

  const direction = useSelector(state => state.customise.direction)
  const {notif_list} = useSelector(state => state.auth);

  useEffect(() => {
    setNotifList(notif_list);
  }, [notif_list])

  const clearUserNotifs = () => {
    setNotifList([]);
    dispatch(clearAllNotif());
  }

  const notificationMenu = (
    <div className="hp-border-radius hp-border-1 hp-border-color-black-40 hp-bg-black-0 hp-bg-dark-100 hp-border-color-dark-80 hp-pt-24 hp-pb-18 hp-px-18 hp-mt-18" style={{ width: 288 }}>
      <Row align="middle" justify="space-between" className="hp-mb-18">
        <Col className="h5 hp-text-color-black-100 hp-text-color-dark-10 hp-text-color-dark-0 hp-mr-64">
        {/* <RiBellLine size={18} className="hp-text-color-primary-1 hp-mr-10" />  */}
        Notifications
        </Col>
        {
          notifList.length ? (
            <Col className="hp-bg-color-primary-1 hp-border-radius-full hp-badge-text hp-text-color-black-0 hp-py-4 hp-px-6 hp-ml-24">
              {notifList.length} New
            </Col>
          ) : ""
        }
      </Row>

      <Divider className="hp-my-4" />

      <div className="hp-overflow-y-auto hp-px-10" style={{ maxHeight: 300, marginRight: -10, marginLeft: -10 }}>
        {
          notifList.map((item, index) => {
            return (
              <Row align="middle" key={index} className="hp-cursor-pointer hp-border-radius hp-transition hp-border-1 hp-hover-bg-primary-4 hp-hover-bg-dark-80 hp-py-8 hp-px-10" style={{ marginLeft: -10, marginRight: -10 }}>
                <Col className="hp-mr-8">
                  <Avatar
                    size={18}
                    icon={<RiBellLine size={16} className={item?.attributes?.notification?.status == "approved" ? "hp-text-color-success-1" : (item?.attributes?.notification?.status == "returned" ? "hp-text-color-danger-1" : "hp-text-color-primary-1")} />}
                    className={`hp-d-flex-center-full {item?.attributes?.notification?.status == "approved" ? "hp-bg-color-success-4" : (item?.attributes?.notification?.status == "returned" ? "hp-bg-color-danger-4" : "hp-bg-color-primary-4")}`}
                  />
                </Col>
                  {item?.attributes?.notification?.data_entry + " | " + moment(item?.attributes?.notification?.notification_date).tz('Asia/Manila').format('LLL')}
                <Col>
                  <span className="hp-d-block hp-w-100 hp-mb-4 hp-font-weight-300 hp-p1-body">
                    {
                       `${item?.attributes?.notification?.entity} has been ${item?.attributes?.notification?.status} by ${item?.attributes?.notification?.from?.name} from ${item?.attributes?.notification?.from?.country}`
                    }
                </span>
                </Col>
              </Row>
            )
          })
        }
        {
          notifList.length == 0 ? (
            <Row align="middle" className="hp-cursor-pointer hp-border-radius hp-transition hp-border-1 hp-hover-bg-primary-4 hp-hover-bg-dark-80 hp-py-8 hp-px-10" style={{ marginLeft: -10, marginRight: -10 }}>
            <Col className="hp-mr-8">
              <Avatar
                size={38}
                icon={<RiInboxLine size={16} className="hp-text-color-info-1" />}
                className="hp-d-flex-center-full hp-bg-info-4"
              />
            </Col>

            <Col>
              <span className="hp-d-block hp-w-100 hp-mb-4 hp-font-weight-500 hp-p1-body">
                No new notification 
            </span>
            </Col>
          </Row>
          ) : ""
        }
        
      </div>

      <Divider className="hp-my-4" />

      <Button
        type="text"
        block
        className="hp-text-color-primary-1 hp-text-color-dark-primary-2 hp-fill-primary-1 hp-fill-dark-primary-2 hp-hover-bg-primary-4 hp-hover-bg-dark-80 hp-mt-4"
        icon={
          <svg className="hp-mr-10" width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.8335 3.00004H14.1668V4.33337H12.8335V13C12.8335 13.1769 12.7633 13.3464 12.6382 13.4714C12.5132 13.5965 12.3436 13.6667 12.1668 13.6667H2.8335C2.65669 13.6667 2.48712 13.5965 2.36209 13.4714C2.23707 13.3464 2.16683 13.1769 2.16683 13V4.33337H0.833496V3.00004H4.16683V1.00004C4.16683 0.82323 4.23707 0.65366 4.36209 0.528636C4.48712 0.403612 4.65669 0.333374 4.8335 0.333374H10.1668C10.3436 0.333374 10.5132 0.403612 10.6382 0.528636C10.7633 0.65366 10.8335 0.82323 10.8335 1.00004V3.00004ZM11.5002 4.33337H3.50016V12.3334H11.5002V4.33337ZM5.50016 6.33337H6.8335V10.3334H5.50016V6.33337ZM8.16683 6.33337H9.50016V10.3334H8.16683V6.33337ZM5.50016 1.66671V3.00004H9.50016V1.66671H5.50016Z" />
          </svg>
        }
        onClick={() => clearUserNotifs()}
      >
        Clear all notifications
      </Button>
    </div >
  );

  return (
    <Col className="hp-d-flex-center hp-mr-sm-12 hp-mr-16">
      <Button
        type="text"
        icon={
          <Dropdown overlay={notificationMenu} placement="bottomRight">
            <div className="hp-position-relative">
              {
                notifList.length ? (
                  <div className="hp-position-absolute" style={direction == "rtl" ? { left: -5, top: -5 } : { right: -5, top: -5 }}>
                    <Badge
                      dot
                      status="processing"
                    />
                  </div>
                ) : ""
              }
             
              <Notification
                set="curved"
                className="hp-text-color-black-60"
              />
            </div>
          </Dropdown>
        }

       
      />
    </Col>
  );
};