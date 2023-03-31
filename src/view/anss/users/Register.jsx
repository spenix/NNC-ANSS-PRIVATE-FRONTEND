import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { Row, Col, Form, Input, Button, Alert, notification } from "antd";

import {
	RiCloseFill,
	RiCheckboxCircleFill
  } from "react-icons/ri";

import LeftContent from "../../pages/authentication/leftContent";

// redux
import { verifyUserInvitation, register } from "../../../redux/auth/authActions";

import { Redirect } from 'react-router';
import data from "../../components/general/icons/data";

export default function Register() {


	const { token } = useParams();


	const [firstName, setFirstName] = useState("");
	const [middleName, setMiddleName] = useState("");
	const [lastName, setLastName] = useState("");
	const [password, setPassword] = useState("");
	const [loadRegisterBtn, setLoadRegisterBtn] = useState(false);
	const [redirectLogin, setRedirectLogin] = useState(false);



  // Redux
	const dispatch = useDispatch();

  	const { isVerifySuccess, errorCode, email, message, registerSuccess } = useSelector(state => state.auth);

	const [form] = Form.useForm();

	// Get Data
	useEffect(() => {
		dispatch(verifyUserInvitation(token))
		.then(() => {
			// empty the fields in form
			form.setFieldsValue({
			  email: email,
			});
		  })
		  .catch((e) => {
			console.log(e);
			console.log(false);
		  });

	 }, [dispatch, email]);

	const openSuccessNotification = () => {
		notification.open({
		  message: "Success",
		  description: "Register has been successful.",
		  icon: <RiCheckboxCircleFill style={{ color: "#00F7BF" }} />,
		  closeIcon: (
			<RiCloseFill className="remix-icon hp-text-color-black-80" size={24} />
		  ),
		});
	};

	const onFinish = (values) => {
		const params = {
			"firstName": values.firstName,
			"middleName": values.middleName,
			"lastName": values.lastName,
			"verificationKey": token,
			"password": password
		}


		setLoadRegisterBtn(true);

		dispatch(
			register(params)
		)
		.then(() => {
			console.log("success");

			setLoadRegisterBtn(false);


			openSuccessNotification();

			setRedirectLogin(true);


		})
		.catch((e) => {
			console.log(message);
			setLoadRegisterBtn(false);


		});


	}

	if(!isVerifySuccess) {
		if(errorCode != 200) {
			return <Redirect to="/*" />;
		}
	}

	if(redirectLogin) {

		return <Redirect to="/login" />;

	}

	const renderErrorAlert = () => {

		// console.log(isError);
		return !registerSuccess ?
			  <Alert
				className="hp-mt-16"
				message="Error"
				description={message}
				type="error"
			  />
			: null;
	  }

	const openPrivacyPolicy = () => {
		
	}

	return (
		<Row gutter={[32, 0]} className="hp-authentication-page">
			<LeftContent />

			<Col md={12}>
			<Row className="hp-h-100" align="middle" justify="center">
				<Col
					xxl={11}
					xl={15}
					lg={20}
					md={20}
					sm={24}
					className="hp-px-sm-8 hp-pt-24 hp-pb-48"
				>
					<h1>Create Account</h1>
					<p className="hp-mt-8 hp-text-color-black-60">
					Please register your personal details and password.
					</p>

					{renderErrorAlert()}

					<Form
					form={form}
					layout="vertical"
					name="basic"
					className="hp-mt-sm-16 hp-mt-32"
					onFinish={onFinish}
					>
						<Form.Item name="firstName" label="First Name :" rules={[{ required: true, message: 'This is required!' }]}>
							<Input id="firstName" onChange={(e) => setFirstName(e.target.value)} />
						</Form.Item>

						<Form.Item name="middleName" label="Middle Name :" >
							<Input id="middleName" onChange={(e) => setMiddleName(e.target.value)} />
						</Form.Item>

						<Form.Item name="lastName" label="Last Name :" rules={[{ required: true, message: 'This is required!' }]}>
							<Input id="lastName" onChange={(e) => setLastName(e.target.value)}/>
						</Form.Item>

						<Form.Item id="email" name="email" label="E-mail :">
							<Input id="validating" disabled={true}/>
						</Form.Item>

						<Form.Item name="password"
								label="Password :"
								rules={[{ required: true, message: 'This is required!' }]}
								hasFeedback
								>
							<Input.Password id="password" onChange={(e) => setPassword(e.target.value)}/>
						</Form.Item>

						<Form.Item name="confirmPassword"
								label="Confirm Password :"
								rules={[{ required: true, message: 'This is required!' },({ getFieldValue }) => ({
									validator(_, value) {
									  if (!value || getFieldValue('password') === value) {
										return Promise.resolve();
									  }
									  return Promise.reject(new Error('The two passwords that you entered do not match!'));
									},
								  }),]}
								hasFeedback
								>
							<Input.Password id="confirm-password" />
						</Form.Item>

						<Form.Item className="hp-mt-16 hp-mb-8">
							<Button block type="primary" htmlType="submit" loading={loadRegisterBtn}>
								Register
							</Button>
						</Form.Item>
					</Form>

					<div className="hp-form-info">
					<span className="hp-text-color-black-80 hp-text-color-dark-40 hp-caption hp-mr-4">
						Already have an account?
					</span>

					<Link
						to="/pages/authentication/login"
						className="hp-text-color-primary-1 hp-text-color-dark-primary-2 hp-caption"
					>
						Login
					</Link>
					</div>

					<div className="hp-other-links hp-mt-24">
					<a href="#" onClick={() => openPrivacyPolicy()} className="hp-text-color-black-80 hp-text-color-dark-40">
						Privacy Policy
					</a>
					<a href="#" className="hp-text-color-black-80 hp-text-color-dark-40">
						Term of use
					</a>
					</div>
				</Col>
			</Row>
			</Col>
		</Row>
	);
};