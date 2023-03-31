import React, { useState, useEffect } from "react";

import {
  Row,
  Col,
  Divider,
  Form,
  Input,
  DatePicker,
  TimePicker,
  Button,
  Modal,
  message,
  Alert
} from "antd";

import { RiCloseFill, RiCalendarLine } from "react-icons/ri";
import { updateMyProfileDetails } from "../../../redux/users/usersActions";
import { useDispatch, useSelector } from 'react-redux';


export default function InfoProfile({myprofile, handleFetchProfileDetails}) {
  const [contactModalVisible, setContactModalVisible] = useState(false);
  const [preferanceModalVisible, setPreferanceModalVisible] = useState(false);
  const [loadEditBtn, setLoadEditBtn] = useState(false);
  const { myprofileMessage, isError  } = useSelector(state => state.users);
  const [form] = Form.useForm();

    // Redux
    const dispatch = useDispatch();
  useEffect(() => {
    form.setFieldsValue({
      completeName: myprofile?.complete_name,
      mobileNumber: myprofile?.mobile_number,
      email: myprofile?.email,
    });
	 }, [myprofile]);

  const listTitle = "hp-p1-body";
  const listResult = "hp-mt-sm-4 hp-p1-body hp-text-color-black-100 hp-text-color-dark-0";
  const dividerClass = "hp-border-color-black-40 hp-border-color-dark-80";

  const contactModalShow = () => {
    setContactModalVisible(true);
  };

  const contactModalCancel = () => {
    setContactModalVisible(false);
  };

  const preferanceModalShow = () => {
    setPreferanceModalVisible(true);
  };

  const preferanceModalCancel = () => {
    setPreferanceModalVisible(false);
  };

  const submitUpdateProfile = (values) => {

    setLoadEditBtn(true);

    dispatch(
      updateMyProfileDetails(values)
    )
    .then(() => {
      console.log("toggleSidebar");
      setLoadEditBtn(false);
      setContactModalVisible(false);
      message.success("Profile details has been updated!");
      handleFetchProfileDetails();

      // empty the fields in form
      // form.setFieldsValue({
      //   email: "",
      // });
    })
    .catch((e) => {
      setLoadEditBtn(false);
    });
  }

  const renderErrorAlert = () => {
    // console.log(isError);
    return isError ?
          <Alert
            className="hp-mt-16"
            message="Error"
            description={myprofileMessage}
            type="error"
            closable
          />
        : null;
  }

  const {complete_name, mobile_number, roles, email, organization} = myprofile;

  const validateMessages = {
    required: '${label} is required!',
    types: {
      email: '${label} is not a valid email!'
    }
  };

  return (
    <div>
      <Modal
        title="Edit Profile Information"
        width={416}
        centered
        visible={contactModalVisible}
        onCancel={contactModalCancel}
        footer={null}
        getContainer={false}
        closeIcon={
          <RiCloseFill className="remix-icon text-color-black-100" size={24} />
        }
      >
        {renderErrorAlert()}
        <Form
          form={form}
          layout="vertical"
          name="basic"
          onFinish={submitUpdateProfile}
          validateMessages={validateMessages}
          >
          <Form.Item label="Complete Name" name="completeName" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Mobile Number" name="mobileNumber">
            <Input />
          </Form.Item>

          <Form.Item label="Email" name="email" rules={[{ required: true, type:"email" }]}>
            <Input disabled={true}/>
          </Form.Item>

          <Row>
          <Col md={12} span={24} className="hp-mt-sm-12 hp-pl-sm-0 hp-pr-12 ">
              <Button block onClick={contactModalCancel}>
                Cancel
              </Button>
            </Col>
            <Col md={12} span={24} className="hp-pr-sm-0 hp-pl-12">
              <Button
                block
                type="primary"
                htmlType="submit"
                loading={loadEditBtn}
              >
                Save
              </Button>
            </Col>

            
          </Row>
        </Form>
      </Modal>

      <Modal
        title="Preferance Edit"
        width={316}
        centered
        visible={preferanceModalVisible}
        onCancel={preferanceModalCancel}
        footer={null}
        closeIcon={
          <RiCloseFill className="remix-icon text-color-black-100" size={24} />
        }
      >
        <Form layout="vertical" name="basic" initialValues={{ remember: true }}>
          <Form.Item label="Language" name="language">
            <Input />
          </Form.Item>

          <Form.Item label="Date Format" name="dateformat">
            <DatePicker
              className="hp-w-100"
              suffixIcon={
                <RiCalendarLine className="remix-icon hp-text-color-black-60" />
              }
            />
          </Form.Item>

          <Form.Item label="Timezone" name="timezone">
            <TimePicker className="hp-w-100" />
          </Form.Item>

          <Row>
            <Col md={12} span={24} className="hp-pr-sm-0 hp-pr-12">
              <Button
                block
                type="primary"
                htmlType="submit"
                onClick={preferanceModalCancel}
              >
                Edit
              </Button>
            </Col>

            <Col md={12} span={24} className="hp-mt-sm-12 hp-pl-sm-0 hp-pl-12">
              <Button block onClick={preferanceModalCancel}>
                Cancel
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal>

      <Row align="middle" justify="space-between">
        <Col md={12} span={24}>
          <h3>Profile Information</h3>
        </Col>

        <Col md={12} span={24} className="hp-profile-action-btn hp-text-right">
          <Button type="primary" ghost onClick={contactModalShow}>
            Edit
          </Button>
        </Col>

        <Col
          span={24}
          className="hp-profile-content-list hp-mt-8 hp-pb-sm-0 hp-pb-120"
        >
          <ul>
            <li>
              <span className={listTitle}>Complete Name</span>
              <span className={listResult}>{complete_name}</span>
            </li>

            <li className="hp-mt-18">
              <span className={listTitle}>Email</span>
              <span className={listResult}>{email}</span>
            </li>

            <li className="hp-mt-18">
              <span className={listTitle}>Phone</span>
              <a className={listResult} href="tel:+900374323">
                {mobile_number}
              </a>
            </li>

            <li className="hp-mt-18">
              <span className={listTitle}>Role(s)</span>
              <span className={listResult}>{Array.isArray(roles) ? roles.join(', ') : roles}</span>
            </li>

            <li className="hp-mt-18">
              <span className={listTitle}>AMS</span>
              <span className={listResult}>{organization?.name}</span>
            </li>
          </ul>
        </Col>
      </Row>

      {/* <Divider className={dividerClass} />

      <Row align="middle" justify="space-between">
        <Col md={12} span={24}>
          <h3>Preferance</h3>
        </Col>

        <Col md={12} span={24} className="hp-profile-action-btn hp-text-right">
          <Button type="primary" ghost onClick={preferanceModalShow}>
            Edit
          </Button>
        </Col>

        <Col span={24} className="hp-profile-content-list hp-mt-sm-8 hp-mt-24">
          <ul>
            <li>
              <span className={listTitle}>Language</span>
              <span className={listResult}>English</span>
            </li>

            <li className="hp-mt-18">
              <span className={listTitle}>Date Format</span>
              <span className={listResult}>YYY.d.M</span>
            </li>

            <li className="hp-mt-18">
              <span className={listTitle}>Timezone</span>
              <span className={listResult}>Cairo (GMT+3)</span>
            </li>
          </ul>
        </Col>
      </Row> */}
    </div>
  );
}
