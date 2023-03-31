import React, { useState } from "react";
import { Row, Col, Divider, Form, Input, Button, message, Alert } from "antd";
import { useDispatch, useSelector } from 'react-redux';

import { changePassword } from "../../../redux/users/usersActions";
import { connectStats } from "react-instantsearch-dom";

export default function PasswordProfile() {
  const dispatch = useDispatch();
  const { myprofileMessage, isError  } = useSelector(state => state.users);
  const dividerClass = "hp-border-color-black-40 hp-border-color-dark-80";
  const [loadEditBtn, setLoadEditBtn] = useState(false);
  const [form] = Form.useForm();

  const validateMessages = {
    required: '${label} is required!',
    types: {
      email: '${label} is not a valid email!'
    }
  }

  const emptyFields = () => {
    form.setFieldsValue({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  }

  const renderErrorAlert = () => {
    console.log(myprofileMessage);
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

  const submitChangePassword = (values) => {
    setLoadEditBtn(true);
    dispatch(
      changePassword(values)
    )
    .then(() => {
      setLoadEditBtn(false);
      message.success("Password changed successfully !");
      emptyFields();
    })
    .catch((e) => {
      setLoadEditBtn(false);
    });
  }

  return (
    <Row>
      <Col span={24}>
        <h2>Change Password</h2>
        <p className="hp-p1-body hp-mb-0">
          Set a unique password to protect your account.
         </p>

        <Divider className={dividerClass} />
      </Col>

      <Col xxl={5} xl={10} md={15} span={24}>
      {renderErrorAlert()}
        <Form 
          form={form}
          layout="vertical" 
          name="basic"
          onFinish={submitChangePassword}
          validateMessages={validateMessages}
          >
          <Form.Item
            label={
              <span className="hp-input-label hp-text-color-black-100 hp-text-color-dark-0">
                Old Password :
              </span>
            }
            name="oldPassword"
            rules={[{ required: true, message: 'This is required!' }]}

          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label={
              <span className="hp-input-label hp-text-color-black-100 hp-text-color-dark-0">
                New Password :
              </span>
            }
            name="newPassword"
            rules={[{ required: true, message: 'This is required!' }]}

          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label={
              <span className="hp-input-label hp-text-color-black-100 hp-text-color-dark-0">
                Confirm New Password :
              </span>
            }
            name="confirmPassword"
            rules={[{ required: true, message: 'This is required!' }]}

          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button block 
            type="primary"
            htmlType="submit"
            loading={loadEditBtn}>
              Change Password
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
}