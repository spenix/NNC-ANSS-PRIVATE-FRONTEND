import { Row, Col, Button, Input, Table, Card, Tag, Space, Popconfirm, notification, Dropdown, Menu, Modal } from "antd";
import { useState, useEffect, useRef  } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { SearchOutlined, DownOutlined } from '@ant-design/icons';
import { Search, Delete, EditSquare } from "react-iconly";
import { RiAddBoxLine, RiErrorWarningLine, RiEyeLine, RiDraftLine, RiInformationLine } from "react-icons/ri";

import { ACTION_VIEW, ACTION_EDIT, ACTION_DELETE, ACTION_ADD} from '../../../utils/LangConstants';
import { getAllForTblData, deleteContactUsData, searchDataList} from "../../../redux/contact-us/contactUsActions";
import { callNotif } from '../../../utils/global-functions/minor-functions';

import BreadCrumbs from '../../../layout/components/content/breadcrumbs';
import Highlighter from 'react-highlight-words';

export default function TableList(props) {
  const {pageRoles} = props;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false)
  const [listParams, setListParams] = useState(false)
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  })
  const { confirm } = Modal;
  const [sorter, setSorter] = useState({})
  const [filters, setFilters] = useState({})
  const [data, setData] = useState([])
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  // Redux
  const dispatch = useDispatch();
  const { contactUs_data } = useSelector((state) => state.contactUs);
  // Sidebar
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const handleFilter = (val) => {
    console.log(val);
    setSearchTerm(val);
    fetch(pagination, filters, sorter, val);
  };
  const openNotificationWithIcon = (type, title = "", msg = "") => {
    callNotif(title, msg, type);
  };

  // Get Data 
  useEffect(() => {
    fetch(pagination);
  }, []);

  const processData = () => {
    const results = [];
    if(typeof contactUs_data !== 'undefined'){
      for (let i = 0; i < contactUs_data.length; i++) {
        results.push({
          key: contactUs_data[i].id,
          datetime_posted: contactUs_data[i]?.attributes?.datetime_posted,
          name: contactUs_data[i]?.attributes?.fullname,
          email_address: contactUs_data[i]?.attributes?.email,
          subject: contactUs_data[i]?.attributes.subject,
          message: contactUs_data[i]?.attributes.message,
        });
      }
      setData(results);
    }
    setIsDataFetched(false);
  }

  const confirmDel = (id) => {
    if(pageRoles.includes(ACTION_DELETE)){
      dispatch(deleteContactUsData({}, id))
      .then(()=> {
        openNotificationWithIcon("success", "Success", "Inquiry data was deleted successfully.")
        fetch();
      });
    }else{
      openNotificationWithIcon('info', "Information", `Oops! can't execute, you don't have ${ACTION_DELETE} permission.`);
    }
    
  }

  const viewDataDetails = (detail) => {
    console.log(detail);
    Modal.info({
      icon: (
          <RiDraftLine className="remix-icon"/>
      ),
      title: (
        <h5 className="hp-mb-0 hp-font-weight-500">View Inquiry Details</h5>
      ),
      width:800,
      content: (
        <ul style={{ listStyle:"none" }}>
          <li><b>Datetime Posted: </b>{detail?.datetime_posted}</li>
          <li><b>Name: </b>{detail?.name}</li>
          <li><b>Email: </b>{detail?.email_address}</li>
          <li><b>Subject: </b>{detail?.subject}</li>
          <li><b>Message: </b>{detail?.message}</li>
        </ul>
      ),
      okText:"Close",
      okButtonProps: {
        type:"default",
        className: 'hp-btn-outline hp-text-color-black-100 hp-border-color-black-100 hp-hover-bg-black-100'
      },
      onOk() {},
    });
  }

  const handleButtonClick = (e, detail) => {
    if(e?.key == ACTION_DELETE){
      confirm({
        title: (
          <>
            <h5 className="hp-mb-0 hp-font-weight-500">
            Are you sure you want to delete this Inquiry?
            </h5>
          </>
        ),
        icon: (
          <span className="remix-icon">
            <RiInformationLine />
          </span>
        ),
        content: (""),
        okText: "Yes",
        okType: "primary",
        cancelText: "No",
        onOk() {
          confirmDel(detail?.key);
        },
        onCancel() {},
      });
    }
    else if(e?.key == ACTION_VIEW) {
      viewDataDetails(detail)
    }
  }
  
  const showBtnForAction = (dataIndex) => {
      return (
        <Dropdown.Button
              key={dataIndex.key}
              size="small"
              icon={<DownOutlined />}
              overlay={
                <Menu onClick={(e) =>{handleButtonClick(e, dataIndex)}}>
                  {
                    ['view','delete'].map(item => {
                        if(pageRoles.includes(item)){  
                          return <Menu.Item key={item} value={dataIndex}>{item.toUpperCase()}</Menu.Item>
                        }
                    })
                  }
                </Menu>
              }
            >
              Action
            </Dropdown.Button>
      );
  }

  const columns = [
    {
      title: "Date/Time Posted",
      dataIndex: "datetime_posted",
      width: "20%",
      align: "left",
      sorter: true,
    },
    {
      title: "Name",
      dataIndex: "name",
      width: "15%",
      align: "left",
      sorter: true,
    },
    {
        title: "Email Address",
        dataIndex: "email_address",
        width: "15%",
        align: "left",
        sorter: true,
    },
    {
        title: "Subject",
        dataIndex: "subject",
        width: "15%",
        align: "left",
        sorter: true,
    },
    {
        title: "Message",
        dataIndex: "message",
        width: "15%",
        align: "left",
        sorter: true,
    },
    {
        title: "Actions",
        dataIndex: "key",
        width: "15%",
        align: "center",
        render: (_, dataIndex) => (
            <Space>
                {showBtnForAction(dataIndex)}
            </Space>
          ),
      },
  ];

  const handleTableChange = (pagination, filters, sorter) => {
    setSorter(sorter);
    setFilters(filters);
    fetch(pagination, filters, sorter, searchTerm);
  };

  const fetch = (params = {}, filters={},  sorter={}, search_key="") => {
    setLoading(true);
    const dataParams = {
      limit: params.pageSize,
      page: params.current
    };
    if(Object.keys(sorter).length){
      dataParams['sort_key'] = sorter?.field
      dataParams['order'] = sorter?.order == "descend" ? "desc" : "asc"
    }
    if(search_key != ''){
      dataParams['search_key'] = search_key
    }
    dispatch(searchDataList(dataParams))
      .then(() => {
        setLoading(false)
        setListParams(params);
        setIsDataFetched(true);
      })
  }
  
  if(isDataFetched) {
    processData();
  }

  return (
    <>
      <Row
        className="hp-mb-16"
	      justify="space-between"
        gutter={{
          xs: 4,
          sm: 6,
          md: 16,
          lg: 24,
        }}
      >
        <Col className="gutter-row" span={12}>
          <BreadCrumbs
              homePage = "Home"
              breadCrumbActive="Contact Us"
            />
        </Col>
        <Col className="gutter-row" span={5}>
              <Input
                  placeholder="Search"
                  prefix={<Search set="curved" size={16} className="hp-text-color-black-80" />}
                  value={searchTerm}
                  onChange={(e) => handleFilter(e.target.value)}
                />
        </Col>
      </Row>

      <Card className="hp-contact-card hp-mb-32">
        <Col className="hp-contact-card hp-mt-32">
          <Table
            rowKey={record => record.key}
            columns={columns}
            dataSource={data}
            pagination={pagination}
            loading={loading}
            onChange={handleTableChange}
            scroll={{ x: 'calc(500px + 50%)' }}
          />
        </Col>

        {/* <AddNewAms open={sidebarOpen} toggleSidebar={toggleSidebar} /> */}
      </Card>
    </>
  );
};