import { useEffect, useState } from "react";
import { Modal, Col, Row, Divider, Input, Form, Button, Select, Switch, Alert, Option } from "antd";
// import "../../../assets/style/index.css";

// Redux
import { getAllData, getAllForTblData, deleteMemberStateData } from "../../../redux/asian-countries/asianCountriesAction2";
import { addUser } from "../../../redux/users/usersActions";
import { getRoles } from "../../../redux/roles/rolesActions";
import { useDispatch, useSelector } from 'react-redux';
import {successMsg, errorMsg, warningMsg, infoMsg, callNotif} from '../../../utils/global-functions/minor-functions'
import {ADD_DATA, DELETED_DATA} from '../../../utils/LangConstants'
export default function AddNewUser({ open, toggleSidebar, fetch, pagination }) {
  const { Option } = Select;
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(true);
  const [loadAddUserBtn, setLoadAddUserBtn] = useState(false);
  const { isSuccess, message, isError  } = useSelector(state => state.users);
  const { roles  } = useSelector(state => state.roles);
  const roleChildren = [];
  for (let i = 0; i < roles.length; i++) {
	  roleChildren.push(<Option key={roles[i].id} value={roles[i].id}>{roles[i].attributes.display_name}</Option>);
  }

  // Redux
  const dispatch = useDispatch();
  const {memberState_data, memberState_links, memberState_meta, memberState_details} = useSelector((state) => state.asianCountries);
  const [form] = Form.useForm();
  // Get Data
	useEffect(() => {
		dispatch(getRoles());
    dispatch(getAllForTblData({limit:25}));
	 }, [dispatch]);
   
  const clearFormValue = () => {
    form.resetFields();
  }

  // Form Finish
  const onFinish = (values) => {
    // toggleSidebar();
    setLoadAddUserBtn(true);
    dispatch(
      addUser({
        email: values.email,
        complete_name: values.complete_name,
        party_id:values.party_id,
        mobile_number: values.contact_no,
        status: status,
		    roles: [values.role]
      })
    )
    .then(() => {
      setEmail("");
      setStatus(true);
      toggleSidebar();
      setLoadAddUserBtn(false);
      fetch(pagination);
      clearFormValue();
      callNotif('Success!', `New User Account ${ADD_DATA}`);
    })
    .catch((e) => {
      setLoadAddUserBtn(false);
    });
  };

  const onChangeStatus = (checked) => {
    setStatus(checked)
  }

  const onClose = () => {
      // setEmail("");
      // setStatus(false);
  }

  const renderErrorAlert = () => {
    return isError ?
          <Alert
            className="hp-mt-16"
            message="Error"
            description={message}
            type="error"
            closable
            onClose={onClose}
          />
        : null;
  }

  const handleAfterClose = () => {
    setEmail("");
    setStatus(true);
    clearFormValue();
  }

  
  const validateMessages = {
    required: 'This is required!',
    types: {
      email: 'This is not a valid email!'
    }
  };

  return (
    <Modal
      title="Add User"
      visible={open}
      onCancel={toggleSidebar}
      footer={null}
      bodyStyle={{ padding: 24 }}
      afterClose={handleAfterClose}
    >

      {renderErrorAlert()}
      <Form
        form={form}
        layout="vertical"
        name="basic"
        validateMessages={validateMessages}
        onFinish={onFinish}
      >
        <Row gutter={[8, 0]}>
          <Col md={24} span={24}>
            <Form.Item name="complete_name" label="Complete Name" rules={[{ required: true, message: 'This is required!' }]}>
              <Input placeholder="Enter Complete Name"/>
            </Form.Item>
          </Col>
          <Col md={24} span={24}>
            <Form.Item  name="email" label="Email Address" rules={[{ required: true, type: 'email' }]}>
              <Input value={email} placeholder="Enter Email Address"/>
            </Form.Item>
          </Col>
          <Col md={24} span={24}>
            <Form.Item  name="contact_no" label="Contact Number" rules={[{ required: true, message: 'This is required!' }]}>
                <Input  placeholder="Enter Contact Number"/>
            </Form.Item>
          </Col>
          <Col md={16} span={24} >
            <Form.Item name="party_id" label="Country" rules={[{ required: true, message: 'This is required!' }]}>
                <Select placeholder="Select Country" 
                aria-autocomplete="off"
                showSearch 
                optionFilterProp="children"
                filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                filterSort={(optionA, optionB) =>
                  optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                }>
                  {
                    memberState_data.map(org => {
                      if(org?.attributes?.name != "ANSS")
                              return <Select.Option key={org?.id} value={org?.id}>{org?.attributes?.name}</Select.Option>
                    })
                  }
                  
                </Select>
            </Form.Item>
          </Col>
          <Col md={8} span={24} >
            <Form.Item name="status" label="Is Active?" >
                <Switch  checked={status} value={status} onChange={onChangeStatus} />
            </Form.Item>
          </Col>
		      <Col md={24} span={24}>
            <Form.Item name="role" label="Role" rules={[{ required: true, message: 'This is required!'}]}>
              <Select
                placeholder="Please Select Role"
                optionFilterProp="children"
                filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                style={{ width: '100%' }}
                >
                {roleChildren}
              </Select>
            </Form.Item>
          </Col>



          {/* <Col md={12} span={24}>
            <Form.Item name="phone" label="Phone" rules={[{ required: true, message: 'This is required!' }]}>
              <MaskedInput mask="(111) 111-1111" />
            </Form.Item>
          </Col>

          <Col md={12} span={24}>
            <Form.Item name="role" label="Role" rules={[{ required: true, message: 'This is required!' }]}>
              <Input />
            </Form.Item>
          </Col> */}

          {/* <Col md={12} span={24}>
            <Form.Item name="status" label="Status" rules={[{ required: true, message: 'This is required!' }]}>
              <Select placeholder="Status">
                <Option value="active">Active</Option>
                <Option value="inactive">Inactive</Option>
                <Option value="pending">Pending</Option>
              </Select>
            </Form.Item>
          </Col> */}

          {/* <Col span={24}>
            <Form.Item name="informationText" label="Personel Information Text">
              <Input.TextArea />
            </Form.Item>
          </Col> */}

          {/* <Col span={24}>
            <Form.Item name="aboutText" label="About Text">
              <Input.TextArea />
            </Form.Item>
          </Col> */}

          <Divider />

          <Col span={24}>
            <Button
              loading={loadAddUserBtn}
              type="primary"
              htmlType="submit"
              block
            >
              Add
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};