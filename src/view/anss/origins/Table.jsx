import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// Redux
import { getAllData, getData, getAmsDatas } from "../../../redux/ams-data/amsActions";
import { useDispatch, useSelector } from "react-redux";

import { Row, Col, Button, Input, Table, Card, Space } from "antd";
import { Search } from "react-iconly";
import { RiAddBoxLine } from "react-icons/ri";

// import { columns } from "./Columns";
// import AddNewAms from "./Modal";
import BreadCrumbs from '../../../layout/components/content/breadcrumbs';

export default function UsersList() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Redux
  const dispatch = useDispatch();
  const ams = useSelector((state) => state.ams);
  // Sidebar
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const handleFilter = (val) => {
    setSearchTerm(val);
    dispatch(
      getData({
        q: val,
      })
    );
  };

  // Get Data 
  useEffect(() => {
    dispatch(getAllData(""));
    dispatch(getAmsDatas());
    dispatch(
      getData({
        q: searchTerm,
      })
    );
  }, [dispatch, ams.data.length]);

  const data = [];
  // for (let i = 0; i < ams.data.length; i++) {
  //   data.push({
  //     key: i,
  //     avatar: [ams.data[i].id, ams.data[i].country],
  //     year: ams.data[i].year,
  //     country: ams.data[i].country,
  //     no_indecators: ams.data[i].no_indecators,
  //     modifiedBy: ams.data[i].modifiedBy,
  //     modifiedDate: ams.data[i].modifiedDate,
  //     modified: ams.data[i].modified,
  //   });
  // }

  const columns = [
    {
      title: "Origin",
      dataIndex: "origin",
      align: "left"
    },
    {
      title: "Status",
      dataIndex: "status"
    },
    {
      title: "Actions",
      dataIndex: "actions"
    },
  ];

  return (
    <>
      <div className="hp-mb-16">
        <Row gutter={[32, 32]} justify="space-between">
          <BreadCrumbs
            homePage = "Home"
            breadCrumbActive="Origins"
          />

          <Col md={15} span={24}>
            <Row justify="end" align="middle" gutter={[16]}>
              <Col xs={24} md={12} xl={8}>
                <Input
                  placeholder="Search"
                  prefix={<Search set="curved" size={16} className="hp-text-color-black-80" />}
                  value={searchTerm}
                  onChange={(e) => handleFilter(e.target.value)}
                />
              </Col>

              <Col>
                <Link to={`/origins/forms/add-data/${window.btoa(0)}`}>
                  <Button
                    block
                    className="hp-mt-sm-16"
                    type="primary"
                    icon={<RiAddBoxLine size={16} className="remix-icon" />}
                  >
                    ADD ORIGIN
                  </Button>
                </Link>
              </Col>
            </Row>
          </Col>
        </Row>
        
       
      </div>

      <Card className="hp-contact-card hp-mb-32">
        <Col className="hp-contact-card hp-mt-32">
          <Table
            pagination={{ defaultPageSize: 6 }}
            columns={columns}
            dataSource={data}
            scroll={{ x: 'calc(500px + 50%)' }}
          />
        </Col>

        {/* <AddNewAms open={sidebarOpen} toggleSidebar={toggleSidebar} /> */}
      </Card>
    </>
  );
};