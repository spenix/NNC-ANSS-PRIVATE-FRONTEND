import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";

import { useDispatch, useSelector } from 'react-redux';
import { login, forgotPassword, checkIfVerified } from '../../../../redux/auth/authActions';
import AseanLogo from "../../../../assets/images/logo/anss-logo-new2.png"

import { Row, Col, Form, Input, Button, Checkbox, message, Modal, Space } from "antd";
import { RiFacebookFill } from "react-icons/ri";

import LeftContent from "../leftContent";
import ForgotPasswordModal from "./ForgotPasswordModal";

import { Redirect } from 'react-router';
import PrivacyPolicyModal from "./PrivacyPolicyModal";
export default function Login() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [verified, setVerified] = useState([]);
  const [loadLoginBtn, setLoadLoginBtn] = useState(false);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { isLoggedIn, loginMessage, isVerified } = useSelector(state => state.auth);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [isPrivacyPolicy, setIsPrivacyPolicy] = useState(isVerified);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () =>{ setSidebarOpen(!sidebarOpen)};

  useEffect( () => {
    if(isDataFetched) {
        const formParams = {
          email: form.getFieldValue('email'),
          password: form.getFieldValue('password')
        }
        handleLogin(formParams);
        setIsDataFetched(false);
    }

      if(hasError) {
        console.log(loginMessage);
        message.error(loginMessage);
        setHasError(false);
      }
      document.title = `NNC-ANSS | Login`;
    }, [ hasError, loginMessage, isDataFetched ]
  );

  const onSubmit = (values) => {
	  setLoadLoginBtn(true);
    verifyUser(values);
  };

  const verifyUser = (values) => {
    const dataParams = {
      email: values.email,
    };

    dispatch(checkIfVerified(dataParams))
    .then(() => {
      setLoadLoginBtn(false);
      setIsDataFetched(true);
    })
    .catch((e) => {
      setHasError(true);
      setLoadLoginBtn(false);
    });
  }

  const handleLogin = (values) => {
    if(isVerified || isPrivacyPolicy) {
      dispatch(login(values.email, values.password))
      .then(() => {
        setLoadLoginBtn(false);
        message.success("Login successful!");
        window.location.reload();
      })
      .catch((e) => {
        setHasError(true);
        setLoadLoginBtn(false);
      });
    } else
    {
      message.success("You must agree to Privacy Policy");
      setLoadLoginBtn(false);
    }
  }

  if (isLoggedIn) {
    return <Redirect to="/" />;
  }

  const validateMessages = {
    required: '${label} is required!',
    types: {
      email: '${label} is not a valid email!'
    }
  };

  const openPrivacyPolicy = () => {
    setIsModalVisible(!isModalVisible)
  }

  return (
    <Row gutter={[32, 0]} className="hp-authentication-page">
      <LeftContent />

      <Col lg={12} span={24} className="hp-py-sm-0 hp-py-md-64">
        <Row className="hp-h-100" align="middle" justify="center">
          <Col
            xxl={11}
            xl={15}
            lg={20}
            md={20}
            sm={24}
            className="hp-px-sm-8 hp-pt-24 hp-pb-48"
          >
            {/* <img src={AseanLogo} className="hp-mb-sm-0"/> */}
            <h1 className="hp-mb-sm-0" style={{ color: '#2c5282', fontWeight: 'bold' }}>Welcome</h1>
            {/* <p className="hp-mt-sm-0 hp-mt-8 hp-text-color-black-80 hp-text-color-dark-40">
              Welcome back, please login to your account.
            </p> */}

            <Form
              layout="vertical"
              form={form}
              name="basic"
              initialValues={{ remember: true }}
              className="hp-mt-sm-16 hp-mt-16"
			        validateMessages={validateMessages}
              onFinish={onSubmit}
            >
              <Form.Item name="email" label="Email Address" className="hp-mb-16" rules={[{ required: true, type: 'email' }]}>
                <Input id="email"/>
              </Form.Item>

              <Form.Item name="password" label="Password" className="hp-mb-8" rules={[{ required: true }]}>
                <Input.Password id="password" />
              </Form.Item>

              <Row align="middle" justify="space-between">
                <Form.Item className="hp-mb-0">
                  <Checkbox name="remember">Remember me</Checkbox>
                </Form.Item>

                <Link to={'/login'} onClick={toggleSidebar}>
                  Forgot Password?
                </Link>
              </Row>
              <Row align="middle" justify="space-between">
                <Col className=" hp-mt-24" sm={12} md={12} span={24}>
                  <a href="#" onClick={() => openPrivacyPolicy()} className="hp-text-color-black-80 hp-p-12 hp-text-color-dark-80" style={{color: '#000 !important', fontWeight: 'bold'}}>
                    <u>
                    Privacy Policy
                    </u>
                  </a>
                  {/* <a href="#" className="hp-text-color-black-80 hp-p-12 hp-text-color-dark-80" style={{color: '#000 !important', fontWeight: 'bold'}}>
                    <u>
                    Terms of use
                    </u>
                  </a> */}
                </Col>
                <Col className=" hp-mt-24" sm={12} md={12} span={24}>
                <Form.Item className="hp-mt-16 hp-mb-8" style={{textAlign: 'right'}}>
                    <Button
                      loading={loadLoginBtn}
                      block
                      style={{backgroundColor:"#2c5282", width:"80%"}}
                      type="primary"
                      htmlType="submit">
                      LOG IN
                    </Button>
                </Form.Item>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </Col>

      <ForgotPasswordModal open={sidebarOpen} toggleSidebar={toggleSidebar}/>
      <PrivacyPolicyModal setIsModalVisible={setIsModalVisible} isModalVisible={isModalVisible} setIsPrivacyPolicy={setIsPrivacyPolicy}/>
    </Row>
    
  );
};