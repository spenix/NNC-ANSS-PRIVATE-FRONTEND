import { useState, useEffect, useRef  } from "react";
import { Link, useHistory } from "react-router-dom";
// Redux
import { useDispatch, useSelector } from "react-redux";
import { getAllData, getAllForTblData, deleteUserManualData } from "../../../redux/userManual/userManualActions";

import { Row, Col, Button, Input, Table, Card, Tag, Space, Popconfirm, notification, Modal, Dropdown, Menu} from "antd";
import Highlighter from 'react-highlight-words';
import { SearchOutlined, DownOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Search, Delete, EditSquare } from "react-iconly";
import { RiAddBoxLine, RiErrorWarningLine, RiEyeLine, RiDraftLine } from "react-icons/ri";
import BreadCrumbs from '../../../layout/components/content/breadcrumbs';
import {ACTION_VIEW, ACTION_EDIT, ACTION_DELETE, ACTION_ADD} from '../../../utils/LangConstants';
import {callNotif} from '../../../utils/global-functions/minor-functions';
import moment from "moment-timezone";

export default function TableList(props) {
  const {pageRoles} = props;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false)
  const [listParams, setListParams] = useState(false)
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  })
  const {confirm} = Modal;
  const history = useHistory();

  const [data, setData] = useState([])
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  // Redux
  const dispatch = useDispatch();
  const {userManual_data, userManual_links, userManual_meta, userManual_details, status, message} = useSelector((state) => state.userManual);
  // console.log(ams);
  // Sidebar
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const handleFilter = (val) => {
    setSearchTerm(val);
    // dispatch(
    //   getData({
    //     q: val,
    //   })
    // );
  };
  const openNotificationWithIcon = (type, title = "", msg = "") => {
    callNotif(title, msg, type);
  };

  const btnForAddData = () => {
    if(pageRoles.includes(ACTION_ADD)){
      return (
        <Col className="gutter-row" span={7}>
        <Link to={`/manuals/forms/add-data/${window.btoa(0)}`}>
        <Button
            block
            className="hp-mt-sm-16"
            type="primary"
            // onClick={() => {alert("Under Development.")}}
            onClick={toggleSidebar}
            icon={<RiAddBoxLine size={16} className="remix-icon" />}
          >
            ADD USER MANUAL
          </Button>
          </Link>
        </Col>
      )
    }
  }

  const btnForViewData = (dataIndex) => {
    if(pageRoles.includes(ACTION_VIEW)){
      return (
        <Link
                to={`/manuals/forms/view-data/${window.btoa(dataIndex)}`}
          >
              <RiEyeLine set="broken"  size={24}
                className="hp-cursor-pointer hp-transition hp-hover-text-color-info-1 hp-text-color-black-80"/>
          </Link>
      )
    }
  }

  const btnForEditData = (dataIndex) => {
    if(pageRoles.includes(ACTION_EDIT)){
      return (
        <Link
                to={`/manuals/forms/edit-data/${window.btoa(dataIndex)}`}
          >
              <EditSquare set="broken"  size={24}
                className="hp-cursor-pointer hp-transition hp-hover-text-color-info-1 hp-text-color-black-80"/>
          </Link>
      )
    }
  } 
  
  const btnForDeleteData = (dataIndex) => {
    if(pageRoles.includes(ACTION_DELETE)){
      return (
        <Popconfirm
                placement="topLeft"
                title="Are you sure to delete this manual?"
                onConfirm={() => confirmDel(dataIndex)}
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
      )
    }
  } 

  // Get Data 
  useEffect(() => {
    fetch();
  }, []);

  const processData = () => {
    const results = [];
    console.log(userManual_data);
    if(typeof userManual_data !== 'undefined'){
      for (let i = 0; i < userManual_data.length; i++) {
        results.push({
          key: userManual_data[i].id,
          document_url: userManual_data[i]?.attributes?.document_url,
          description: userManual_data[i]?.attributes.description,
          date_uploaded: moment(userManual_data[i]?.attributes.created_at).tz('Asia/Manila').format('LLL z'),
          actions: availableActions()
        });
      }
      setData(results);
      // if(Object.keys(UserManual_meta).length){
      //   setPagination({
      //     ...listParams.pagination,
      //     total: UserManual_meta.pagination.total, // total regardless of pagination
      //   });
      // }
    }
    setIsDataFetched(false);
  }
  const availableActions = () => {
    const arrAct = [];
    if(pageRoles.includes(ACTION_VIEW)){
      arrAct.push("View");
    }
    if(pageRoles.includes(ACTION_EDIT)){
      arrAct.push("Edit");
    }
    if(pageRoles.includes(ACTION_DELETE)){
      arrAct.push("Delete");
    }

    return arrAct;
  }
  const confirmDel = (id) => {
    if(pageRoles.includes(ACTION_DELETE)){
      dispatch(deleteUserManualData({}, id))
      .then(()=> {
        openNotificationWithIcon("success", "Success", "Manual is deleted successfully.")
        fetch();
      });
    }else{
      openNotificationWithIcon('info', "Information", `Oops! can't execute, you don't have ${ACTION_DELETE} permission.`);
    }
    
  }

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };
  
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div
        style={{
          padding: 8,
        }}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1890ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const redirect = (link) => {
    //sample only
    window.open(link, '_blank');
  }
  const columns = [
    {
      title: "Description",
      dataIndex: "description",
      width: "20%",
      align: "left",
    },
    {
      title: "Date Uploaded",
      dataIndex: "date_uploaded",
      width: "15%",
      align: "left",
    }, 
    {
      title: "File",
      dataIndex: "document_url",
      width: "15%",
      align: "left",
       render: (dataIndex) => (
        <Button onClick={() => {window.open(dataIndex, '_blank')}}className="btn btn-primary">Download</Button>
      )
    },   
    {
      title: "Actions",
      dataIndex: "key",
      width: "15%",
      align: "center",
      render: (_, record) => (
        <Dropdown.Button
        key={record?.key}
        size="small"
        icon={<DownOutlined />}
        overlay={
          <Menu onClick={(e) => handleButtonClick(e, record)}>
            {
             record?.actions?.map((item, key) => {
                return <Menu.Item key={item+"_"+key} value={key}>{item.toUpperCase()}</Menu.Item>
              })
            }
          </Menu>
        }
      >
        Action
      </Dropdown.Button>
        ),
    },
  ];

  const showConfirm = (record, message) => {
    confirm({
      title: message,
      icon: (
        <span className="remix-icon">
          <ExclamationCircleOutlined />
        </span>
      ),
      content: '',
      okText:"Yes",
      onOk() {
        confirmDel(record?.key)
      },
      onCancel() {
      },
    });
  };

  const handleButtonClick = (e, record) => {
    var data = e.key.split("_");
    switch (data[0]) {
      case "View":
        // history.push(`/manuals/forms/view-data/${window.btoa(record.key)}`);
        viewDataDetails(record);
        break;
      case "Edit":
        history.push(`/manuals/forms/edit-data/${window.btoa(record.key)}`)
        break;
      case "Delete":
        showConfirm(record, "Are you sure you want to delete this manual?");
        break;
      default:
        break;
    }
  } 
  const viewDataDetails = (detail) => {
    console.log(detail);
   Modal.info({
     icon: (
         <RiDraftLine className="remix-icon"/>
     ),
     title: (
       <h5 className="hp-mb-0 hp-font-weight-500">View Manual</h5>
     ),
     width:800,
     content: (
       <ul style={{ listStyle:"none" }}>
       <li><b>Description: </b>{detail?.description}</li>
     

           {
             detail?.document_url ? (
               <>
                 <li>
                   <b>File: </b>
                     <Button size="small"  onClick={() => window.open(detail?.document_url, '_blank')}>Download</Button>
                 </li>
                 {/* <li><b>Language: </b>{detail?.other_details?.language}</li> */}
               </>
               
             ) : ""
           }
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
  const handleTableChange = (pagination, filters, sorter) => {
    fetch();
  };

  const fetch = (params = {}) => {
    setLoading(true);
    const dataParams = {
      limit: params.pageSize,
      page: params.current
    };
    dispatch(getAllForTblData(dataParams))
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
              // breadCrumbParent="Maintenance"
              breadCrumbActive="Manual"
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
        
            {btnForAddData()}

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