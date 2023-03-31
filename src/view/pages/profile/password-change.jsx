import React from "react";

import { Row, Col, Divider, Form, Input, Button } from "antd";

export default function PasswordProfile() {
  const dividerClass = "hp-border-color-black-40 hp-border-color-dark-80";

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
        <Form layout="vertical" name="basic">
          <Form.Item
            label={
              <span className="hp-input-label hp-text-color-black-100 hp-text-color-dark-0">
                Old Password :
              </span>
            }
            name="old-password"
          >
            <Input placeholder="Placeholder text" />
          </Form.Item>

          <Form.Item
            label={
              <span className="hp-input-label hp-text-color-black-100 hp-text-color-dark-0">
                New Password :
              </span>
            }
            name="new-password"
          >
            <Input placeholder="Placeholder text" />
          </Form.Item>

          <Form.Item
            label={
              <span className="hp-input-label hp-text-color-black-100 hp-text-color-dark-0">
                Confirm New Password :
              </span>
            }
            name="confirm-new-password"
          >
            <Input placeholder="Placeholder text" />
          </Form.Item>

          <Form.Item>
            <Button block type="primary" htmlType="submit">
              Change Password
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
}