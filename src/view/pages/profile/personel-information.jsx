import React, { useState } from "react";

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
} from "antd";

import { RiCloseFill, RiCalendarLine } from "react-icons/ri";

export default function InfoProfile() {
  const [contactModalVisible, setContactModalVisible] = useState(false);
  const [preferanceModalVisible, setPreferanceModalVisible] = useState(false);

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

  return (
    <div>
      <Modal
        title="Contact Edit"
        width={416}
        centered
        visible={contactModalVisible}
        onCancel={contactModalCancel}
        footer={null}
        closeIcon={
          <RiCloseFill className="remix-icon text-color-black-100" size={24} />
        }
      >
        <Form layout="vertical" name="basic" initialValues={{ remember: true }}>
          <Form.Item label="Full Name" name="fullname">
            <Input />
          </Form.Item>

          <Form.Item label="Display Name" name="displayname">
            <Input />
          </Form.Item>

          <Form.Item label="Email" name="email">
            <Input />
          </Form.Item>

          <Form.Item label="Phone" name="phone">
            <Input />
          </Form.Item>

          <Form.Item label="Date of Birth" name="dateofbirth">
            <DatePicker
              className="hp-w-100"
              suffixIcon={
                <RiCalendarLine className="remix-icon hp-text-color-black-60" />
              }
            />
          </Form.Item>

          <Form.Item label="Address" name="address">
            <Input.TextArea rows={3} />
          </Form.Item>

          <Row>
            <Col md={12} span={24} className="hp-pr-sm-0 hp-pr-12">
              <Button
                block
                type="primary"
                htmlType="submit"
                onClick={contactModalCancel}
              >
                Edit
              </Button>
            </Col>

            <Col md={12} span={24} className="hp-mt-sm-12 hp-pl-sm-0 hp-pl-12">
              <Button block onClick={contactModalCancel}>
                Cancel
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

      <Col md={15} span={24}>
        <h2>Profile Informations</h2>
        <p className="hp-p1-body hp-mb-0">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur
          sodales sit amet nunc et vehicula. Mauris sed lectus nisi.
        </p>
      </Col>

      <Divider className={dividerClass} />

      <Col md={15} span={24}>
        <h3>About</h3>
        <p className="hp-p1-body hp-mb-0">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur
          sodales sit amet nunc et vehicula. Mauris sed lectus nisi. Suspendisse
          velit mi, pretium non euismod vitae Suspendisse velit mi, pretium non
          euismod vitae
        </p>
      </Col>

      <Divider className={dividerClass} />

      <Row align="middle" justify="space-between">
        <Col md={12} span={24}>
          <h3>Contact</h3>
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
              <span className={listTitle}>Full Name</span>
              <span className={listResult}>Edward Yıldırım</span>
            </li>

            <li className="hp-mt-18">
              <span className={listTitle}>Display Name</span>
              <span className={listResult}>Edward.3</span>
            </li>

            <li className="hp-mt-18">
              <span className={listTitle}>Email</span>
              <span className={listResult}>Add Email</span>
            </li>

            <li className="hp-mt-18">
              <span className={listTitle}>Phone</span>
              <a className={listResult} href="tel:+900374323">
                +90 037 43 23
              </a>
            </li>

            <li className="hp-mt-18">
              <span className={listTitle}>Date of Birth</span>
              <span className={listResult}>02/03/94</span>
            </li>

            <li className="hp-mt-18">
              <span className={listTitle}>Address</span>
              <span className={listResult}>Lorem ipsum dolor sit 07/6</span>
            </li>
          </ul>
        </Col>
      </Row>

      <Divider className={dividerClass} />

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
      </Row>
    </div>
  );
}
