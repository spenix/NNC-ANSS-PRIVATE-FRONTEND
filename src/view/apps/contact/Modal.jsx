import { Modal, Col, Row, Divider, Input, Form, Button, Select } from "antd";
import MaskedInput from 'antd-mask-input'

// Redux
import { useDispatch } from "react-redux";
import { addUser } from "../../../redux/contact/contactActions";

export default function AddNewUser({ open, toggleSidebar }) {
  const { Option } = Select;

  // Redux
  const dispatch = useDispatch();

  // Form Finish
  const onFinish = (values) => {
    toggleSidebar();

    dispatch(
      addUser({
        avatar: values.name,
        fullName: values.name,
        username: values.username,
        role: values.role,
        email: values.email,
        contact: values.phone,
        status: values.status,
        informationText: values.informationText,
        aboutText: values.aboutText,
      })
    );
  };

  return (
    <Modal
      title="Add Contact"
      visible={open}
      onCancel={toggleSidebar}
      footer={null}
      bodyStyle={{ padding: 24 }}
    >
      <Form
        layout="vertical"
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Row gutter={[8, 0]}>
          <Col md={12} span={24}>
            <Form.Item name="name" label="Name" rules={[{ required: true, message: 'This is required!' }]}>
              <Input />
            </Form.Item>
          </Col>

          <Col md={12} span={24}>
            <Form.Item name="username" label="User Name" rules={[{ required: true, message: 'This is required!' }]}>
              <Input />
            </Form.Item>
          </Col>

          <Col md={12} span={24}>
            <Form.Item name="email" label="Email" rules={[{ required: true, message: 'This is required!', type: 'email' }]}>
              <Input />
            </Form.Item>
          </Col>

          <Col md={12} span={24}>
            <Form.Item name="phone" label="Phone" rules={[{ required: true, message: 'This is required!' }]}>
              <MaskedInput mask="(111) 111-1111" />
            </Form.Item>
          </Col>

          <Col md={12} span={24}>
            <Form.Item name="role" label="Role" rules={[{ required: true, message: 'This is required!' }]}>
              <Input />
            </Form.Item>
          </Col>

          <Col md={12} span={24}>
            <Form.Item name="status" label="Status" rules={[{ required: true, message: 'This is required!' }]}>
              <Select placeholder="Status">
                <Option value="active">Active</Option>
                <Option value="inactive">Inactive</Option>
                <Option value="pending">Pending</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item name="informationText" label="Personel Information Text">
              <Input.TextArea />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item name="aboutText" label="About Text">
              <Input.TextArea />
            </Form.Item>
          </Col>

          <Divider />

          <Col span={24}>
            <Button
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