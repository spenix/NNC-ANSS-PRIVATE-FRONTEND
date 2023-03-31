
import { Modal, Col, Row, Divider, DatePicker, Form, Button, Select, Input, message } from "antd";
import { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { RiCloseFill, RiCalendarLine } from "react-icons/ri";
import securityLogo from "../../../../assets/images/crypto/trust-wallet.png";
import { forgotPassword } from '../../../../redux/auth/authActions';
import OtpModal from "./OtpModal";

export default function ForgotPassword(props) {
    const dispatch = useDispatch();
    const history = useHistory();
    const [form] = Form.useForm();
    const [loadEditBtn, setLoadEditBtn] = useState(false);
    const { open, toggleSidebar} = props
    const [otpOpen, setOtpOpen] = useState(false);
    const toggleOtp = () =>{ setOtpOpen(!otpOpen)};
    const [params, setParams] = useState(false);

    const submitForgotPassword = (values) => {
      setLoadEditBtn(true);
      const params = {
			"email":values.email
		  };
        dispatch(
          forgotPassword(params)
        )
        .then(() => {

          setLoadEditBtn(false);
          message.success("Email has been sent!");
          toggleSidebar();
          toggleOtp();
          setParams(values.email);
        })
    }
      
    return (
      <Row>
        <Modal
            title="Reset Password"
            width={350}
            visible={open}
            footer={null}
            getContainer={false}
            onCancel={toggleSidebar}
            closeIcon={
              <RiCloseFill className="remix-icon text-color-black-100" size={24} />
            }
            >
            <Row className="hp-h-50" align="middle" justify="center">
            <img src={securityLogo} alt="Logo" style={{ height:80, width:80 }} />
            <p className="hp-text-color-black-80 hp-text-color-dark-40 hp-h-100">
                Enter your Email Address and we'll send you instructions on how to reset your password.
          
            </p>
            </Row>

        <Form
            form={form}
            layout="vertical"
            name="basic"
            onFinish={submitForgotPassword}
            >
            <Form.Item label="Email" name="email" id="email" rules={[{ required: true }]}>
            <Input />
            </Form.Item>
            <Form.Item className="hp-mt-16 hp-mb-8">
            <Button
                block
                type="primary"
                htmlType="submit"
                loading={loadEditBtn}
                >
                Reset Password
            </Button>
            </Form.Item>
            </Form>
        </Modal>
        <OtpModal open={otpOpen} email={params} toggleOtp={toggleOtp}/>
      </Row>
    );
  };
