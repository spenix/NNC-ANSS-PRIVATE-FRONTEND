
import { Modal, Col, Row, Divider, DatePicker, Form, Button, Select, Input, message } from "antd";
import { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import securityLogo from "../../../../assets/images/anss-image/viber_image_2022-04-27_21-17-14-672.png";
import { login, changePassword } from '../../../../redux/auth/authActions';
import { RiCloseFill, RiCalendarLine } from "react-icons/ri";

export default function ResetPasswordModal(props) {
  const [modal, setModal] = useState(false);
  const [loadEditBtn, setLoadEditBtn] = useState(false);
  const { open, toggleRp, email } = props
  const { hash } = useSelector((state) => state.auth);

  const [form] = Form.useForm();
  let history = useHistory();
  // Redux
  const dispatch = useDispatch();
  const submitPassword = ((values) => {
    setLoadEditBtn(true);
    const params = {
      "password": values.password,
      "confirm_password": values.confirm_password,
      "password_hash": hash
    }
      dispatch(
        changePassword(params)
      )
      .then(() => {
        setLoadEditBtn(false);
        toggleRp();
        message.success("Redirecting to portal . . .");

        dispatch(login(email, values.password)) // callling the action
          .then(() => {
            window.location.reload();
          })
          .catch((e) => {
            setHasError(true);
            setLoadLoginBtn(false);
        });
      })
  })

  return (
    <Modal
        title="Change your Password"
        width={350}
        visible={open}
        footer={null}
        onCancel={toggleRp}
        >
        <Row className="hp-h-50" align="middle" justify="center">
        <img src={securityLogo} alt="Logo" style={{ height:80, width:80 }} />
        <p className="hp-text-color-black-80 hp-text-color-dark-40 hp-h-100">
            Please Enter your New Password.
        </p>
        </Row>

        <Form
        form={form}
        layout="vertical"
        name="basic"
        onFinish={submitPassword}
        >
        <Form.Item label="New Password" name="password" id="password" rules={[{ required: true }]}>
        <Input.Password id="password" />
        </Form.Item>
        <Form.Item label="Confirm Password" name="confirm_password" id="confirm_password" rules={[{ required: true }]}>
        <Input.Password id="confirm_password" />
        </Form.Item>
        <Form.Item className="hp-mt-16 hp-mb-8">
        <Button
            block
            type="primary"
            htmlType="submit"
            loading={loadEditBtn}
            >
            Change Password
        </Button>
        </Form.Item>
        </Form>
    </Modal>
  );
};