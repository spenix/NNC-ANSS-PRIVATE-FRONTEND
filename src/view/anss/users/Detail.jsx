import { useEffect, useState } from "react";
import { useParams, Link, useHistory } from "react-router-dom";

// Redux
// import { deleteUser, getUser } from "../../../redux/contact/contactActions";
import { deleteUser, getUser } from "../../../redux/users/usersActions";
import { useDispatch, useSelector } from "react-redux";

import { Layout, Row, Col, Avatar, Button, Divider, Card, Popconfirm } from "antd";
import {
  RiArrowLeftSLine,
  RiUserLine,
  RiErrorWarningLine,
} from "react-icons/ri";

import illustration from "../../../assets/images/apps/contact/sidebar.png";

const { Sider, Content } = Layout;

// services
import UserService from "../../../services/userServices"

export default function Detail() {

	const [selectedUser, setSelectedUser] = useState([])

	const [completeName, setCompleteName] = useState("");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [roles, setRoles] = useState([]);
	const [organization, setOrganization] = useState([]);



	const history = useHistory();
	const dispatch = useDispatch();
	const { id } = useParams(); // this way to get the parameters

	useEffect(() => {

		getSpecificUserDetails(id); // this service is to get the specific user details

	}, [])


  const getSpecificUserDetails = (id) => {

	UserService.getUserDetails(id)
		.then((response) => {
			setCompleteName(response.data.data.attributes.complete_name)
			setFirstName(response.data.data.attributes.first_name)
			setLastName(response.data.data.attributes.last_name)
			setEmail(response.data.data.attributes.email)
			setRoles(response.data.data.attributes.roles)
			setOrganization(response.data.data.attributes.organization.complete_name);

	});

  }

  
	const listTitle = "hp-p1-body";
	const listResult = "hp-mt-sm-4 hp-p1-body hp-text-color-black-100 hp-text-color-dark-0";

	// Popconfirm
	function confirm(userId) {
		history.push("/apps/contact");
		dispatch(deleteUser(userId))
	}

 	// Redux
  	const customise = useSelector(state => state.customise)

  return (
    <Card className="hp-contact-detail hp-mb-32">
      <Layout className="hp-flex-wrap">
        <Sider
          className="hp-p-24 hp-border-right-1 hp-border-color-dark-80"
          theme={customise.theme == "light" ? "light" : "dark"}
          width={254}
        >
          <Row className="hp-h-100">
            <Col span={24}>
              <Row>
                <Col span={24}>
                  <Link to="/users">
                    <Button
                      type="text"
                      shape="square"
                      icon={<RiArrowLeftSLine size={24} />}
                    ></Button>
                  </Link>
                </Col>

                <Col span={24} className="hp-text-center">
                  <Avatar size={128} icon={<RiUserLine className="remix-icon" />} className="hp-m-auto" />
                </Col>

                <Col span={24} className="hp-mt-16 hp-text-center">
                  <h4>{selectedUser.fullName}</h4>
                </Col>

                <Col span={24} className="hp-text-center">
                  <p className="hp-p1-body">{selectedUser.email}</p>
                </Col>

                <Col span={24} className="hp-mt-16">
                  <Popconfirm
                    title="Are you sure to delete this contact?"
                    onConfirm={() => confirm(selectedUser.id)}
                    okText="Yes"
                    cancelText="No"
                    icon={
                      <RiErrorWarningLine className="remix-icon hp-text-color-primary-1" />
                    }
                  >
                    {/* <Button block type="primary">
                      Delete Contact
                    </Button> */}
                  </Popconfirm>
                </Col>
              </Row>
            </Col>

          </Row>
        </Sider>

        <Content className="hp-bg-color-black-0 hp-bg-color-dark-100 hp-p-24">
          {
            selectedUser.informationText && (
              <>
                <Col md={15} span={24}>
                  <h2>Profile Informations</h2>
                  <p className="hp-p1-body hp-mb-0">
                    {selectedUser.informationText}
                  </p>
                </Col>

                <Divider />
              </>
            )
          }

          {
            selectedUser.aboutText && (
              <>
                <Col md={15} span={24}>
                  <h3>About</h3>
                  <p className="hp-p1-body hp-mb-0">
                    {selectedUser.aboutText}
                  </p>
                </Col>

                <Divider />
              </>
            )
          }

          <Row align="middle" justify="space-between">
            <Col md={12} span={24}>
              <h3>User</h3>
            </Col>

            <Col
              span={24}
              className="hp-profile-content-list hp-mt-8 hp-pb-sm-0 hp-pb-120"
            >
              <ul>
                <li>
                  <span className={listTitle}>Complete Name</span>
                  <span className={listResult}>{completeName ? completeName : (firstName ? firstName : '')   + ' ' + (lastName ? lastName : '')}</span>
                </li>

                <li className="hp-mt-18">
                  <span className={listTitle}>Email Address</span>
                  <a className={listResult} href={"mailto:" + email}>
                    {email}
                  </a>
                </li>

				        <li className="hp-mt-18">
                  <span className={listTitle}>AMS</span>
                  <div  >
                    {organization}
                  </div>
                </li>

                <li className="hp-mt-18">
                  <span className={listTitle}>Role(s)</span>
                  <div  >
                    {roles.join(', ')}
                  </div>
                </li>
              </ul>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Card>
  )
};