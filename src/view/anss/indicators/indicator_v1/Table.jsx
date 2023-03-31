import { useState, useEffect, useRef } from "react";
import { useParams, Link, useHistory } from "react-router-dom";
// Redux
import { getAllData, getData, deleteIndicator } from "../../../redux/indicators/indicatorsActions";
import { useDispatch, useSelector } from "react-redux";

import { Row, Col, Button, Input, Table, Card, Popconfirm, Tag, Space } from "antd";
import { Search, Delete, EditSquare } from "react-iconly";
import { RiAddBoxLine, RiErrorWarningLine, RiEyeLine } from "react-icons/ri";

import AddNewIndicatorType from "./Modal";
import BreadCrumbs from '../../../layout/components/content/breadcrumbs';
import store from "../../../redux/store";

export default function IndicatorsList() {
  const [modalAction, setModalAction] = useState("Add");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [indicatorSelected, setIndicatorSelected] = useState({});
  // Redux
  const dispatch = useDispatch();
  const indicators = useSelector((state) => state.indicators);
  // Sidebar
  const toggleSidebar = () =>{ setSidebarOpen(!sidebarOpen)};
  const handleFilter = (val) => {
    setSearchTerm(val);
    dispatch(
      getData({
        q: val,
      })
    );
  };

  const confirm = (dataId) => {
    store.dispatch(deleteIndicator(dataId))
  }
  const clearIndicatorSelected = (param) => {
    if(param == false){setIndicatorSelected({})}
  }
  // Get Data 
  useEffect(() => {
    dispatch(getAllData());
    dispatch(
      getData({
        q: searchTerm,
      })
    );
  }, [dispatch]);

  useEffect(() => {
    clearIndicatorSelected(sidebarOpen);
  },[sidebarOpen])
  const data = [];
    for (let i = 0; i < indicators.data.length; i++) {
      data.push({
        key: indicators.data[i].id,
        name:  indicators.data[i]?.attributes.name,
        description: indicators.data[i]?.attributes.description,
        code: indicators.data[i]?.attributes.code
      });
  }
  const addActionIndicator = () => {
    setModalAction("Add");
    toggleSidebar();
  }

  const getEditSelectedIndicators = (keyInput) => {
    var dataValue = data.filter(indicator => {
         return indicator?.key ==  keyInput;
     });
     setIndicatorSelected(dataValue.length ? dataValue[0] : {});
     setModalAction("Edit");
     toggleSidebar();
  }
 
  const columns = [
    {
      title: "Code",
      dataIndex: "code",
      align: "left",
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
        title: "Description",
        dataIndex: "description",
    },
    {
      title: "Action",
      dataIndex: "key",
      width: '15%',
      render: (dataIndex) => (
      <Space>
           <Link
                 to={`/indicators/detail/${dataIndex}`}
            >
                <RiEyeLine set="broken"  size={24}
                  className="hp-cursor-pointer hp-transition hp-hover-text-color-info-1 hp-text-color-black-80"/>
            </Link>
           <a
            onClick={() => getEditSelectedIndicators(dataIndex)}
          >
              <EditSquare set="broken"  size={24}
                  className="hp-cursor-pointer hp-transition hp-hover-text-color-info-1 hp-text-color-black-80"/>
          </a>
          <Popconfirm
              placement="topLeft"
              title="Are you sure to delete this indicator?"
              onConfirm={() => confirm(dataIndex)}
              okText="Yes"
              cancelText="No"
              icon={
              <RiErrorWarningLine className="remix-icon hp-text-color-primary-1" />
              }
          >
              <Delete
                  size={24}
                  className="hp-cursor-pointer hp-transition hp-hover-text-color-danger-1 hp-text-color-black-80"
              />
          </Popconfirm>
        </Space>
      ),
    },
    
  ];
  return (
    <>
      <div className="hp-mb-32">
        <Row gutter={[32, 32]} justify="space-between">
          <BreadCrumbs
            breadCrumbParent="Maintenance"
            breadCrumbActive="Indicator Repository"
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
                <Button
                  block
                  className="hp-mt-sm-16"
                  type="primary"
                  onClick={addActionIndicator}
                  icon={<RiAddBoxLine size={16} className="remix-icon" />}
                >
                  ADD NEW INDICATOR
                </Button>
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
        <AddNewIndicatorType open={sidebarOpen} toggleSidebar={toggleSidebar} modalAction={modalAction} indicatorSelected={indicatorSelected} />
      </Card>
    </>
  );
};