
import { Modal, Col, Row, Divider, DatePicker, Form, Button, Select, Input, message } from "antd";
import { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useParams, Link, useHistory } from "react-router-dom";
import securityLogo from "../../../../assets/images/anss-image/viber_image_2022-04-27_21-17-14-672.png";
import { verifyOtp } from '../../../../redux/auth/authActions';
import { RiCloseFill, RiCalendarLine } from "react-icons/ri";
import ResetPasswordModal from "./ResetPasswordModal"

export default function OtpModal(props) {
  const [modal, setModal] = useState(false);
  const [loadEditBtn, setLoadEditBtn] = useState(false);
  const { open, toggleOtp, email} = props
  const [rpOpen, setRpOpen] = useState(false);
  const toggleRp = () =>{ setRpOpen(!rpOpen)};

  const [form] = Form.useForm();
  let history = useHistory();
  // Redux
  const dispatch = useDispatch();
  const submitOtp = ((values) => {
    setLoadEditBtn(true);
    const params = {
    "email": email,
    "otp": values.otp
    }
      dispatch(
        verifyOtp(params)
      )
      .then(() => {
        setLoadEditBtn(false);
        toggleOtp();
        toggleRp();
        message.success("Verification Completed!");
      })
  })

  return (
    <Row>
    <Modal
    title="Verify One-Time Password"
    width={350}
    visible={open}
    footer={null}
    closeIcon={
      <RiCloseFill className="remix-icon text-color-black-100" size={24} />
    }
    >
    <Row className="hp-h-50" justify="center" align="middle" gutter={[16, 16]} style={{padding:"10px"}}>
    <img src={securityLogo} alt="Logo" style={{ height:80, width:80 }} />
    
    <p className="hp-text-color-black-80 hp-text-color-dark-40 hp-h-100">
        Enter the OTP that was sent to your email.
    </p>
    </Row>

<Form
    form={form}
    layout="vertical"
    name="basic"
    onFinish={submitOtp}
    >
        
    <Form.Item label="OTP" name="otp" id="otp" rules={[{ required: true }]}>
    <Input />
    </Form.Item>
    <Form.Item className="hp-mt-16 hp-mb-8">
    <Button
        block
        type="primary"
        htmlType="submit"
        loading={loadEditBtn}
        >
        Verify
    </Button>
    </Form.Item>
    </Form>
    </Modal>
    <ResetPasswordModal open={rpOpen} toggleRp={toggleRp} email={email}/>
    </Row>
  );
};