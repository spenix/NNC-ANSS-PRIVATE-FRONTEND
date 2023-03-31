import { useState, useEffect, useRef  } from "react";
import { Link, useHistory } from "react-router-dom";
// Redux
import { getAllData, getAllForTblData, deleteDataSourceTypeData } from "../../../redux/dataSourceTypes/dataSourceTypesActions";
import { useDispatch, useSelector } from "react-redux";

import { Row, Col, Button, Input, Table, Card, Tag, Space, Popconfirm, notification, Modal, Dropdown, Menu } from "antd";
import Highlighter from 'react-highlight-words';
import { SearchOutlined, DownOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Search, Delete, EditSquare } from "react-iconly";
import { RiAddBoxLine, RiErrorWarningLine, RiEyeLine, RiDraftLine  } from "react-icons/ri";

// import { columns } from "./Columns";
// import AddNewAms from "./Modal";
import BreadCrumbs from '../../../layout/components/content/breadcrumbs';
import {ACTION_VIEW, ACTION_EDIT, ACTION_DELETE, ACTION_ADD, DELETED_DATA} from '../../../utils/LangConstants';
import {callNotif} from '../../../utils/global-functions/minor-functions';
export default function UsersList(props) {
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
  const {dataSourceType_data, dataSourceType_links, dataSourceType_meta, dataSourceType_details, status, message} = useSelector((state) => state.dataSourceTypes);
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

  useEffect(() => {
    errMsg();
  }, [status]);

  const clearErrMessage = () => {
    dispatch({
        type: 'SET_SOURCE_TYPE_DATA_MESSAGE',
        status: '',
        msg: '',
    });
  }
  const errMsg = () => {
    if(typeof status == "string" && status == "error"){
        if(message != "") {
            if(typeof message == "object"){
              message.forEach(item => {
                  openNotificationWithIcon(status, "Error", item)
              });
            }else{
                openNotificationWithIcon(status, "Error", message)
            }
        }
        clearErrMessage();
    }
  }

  const openNotificationWithIcon = (type, title = "", msg = "") => {
    callNotif(title, msg, type);
  };

  // Get Data 
  useEffect(() => {
    fetch(pagination);
  }, []);

  const processData = () => {
    const results = [];
    if(typeof dataSourceType_data !== 'undefined'){
      console.log(dataSourceType_data);
      for (let i = 0; i < dataSourceType_data.length; i++) {
        results.push({
          key: dataSourceType_data[i].id,
          source_type: dataSourceType_data[i]?.attributes?.name,
          source_type_desc: dataSourceType_data[i]?.attributes?.description,
          is_active: dataSourceType_data[i]?.attributes?.is_active,
          actions:availableActions()
        });
      }
      setData(results);
      if(Object.keys(dataSourceType_meta).length){
        setPagination({
          ...listParams.pagination,
          total: dataSourceType_meta.pagination.total, // total regardless of pagination
        });
      }
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



  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };
  
  const confirmDel = (id) => {
    if(pageRoles.includes(ACTION_DELETE)){
      dispatch(deleteDataSourceTypeData({}, id))
      .then(()=> {
        openNotificationWithIcon("success", "Success", `Data Source Type ${DELETED_DATA}`)
        fetch(pagination);
      }).catch((e) => {
        errMsg();
      });
    }else{
      openNotificationWithIcon('info', "Information", `Oops! can't execute, you don't have ${ACTION_DELETE} permission.`);
    }

  }

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


  const btnForAddData = () => {
    if(pageRoles.includes(ACTION_ADD)){
      return (
        <Col className="gutter-row" span={7}>
          <Link to={`/data-source-types/forms/add-data/${window.btoa(0)}`}>
            <Button
              block
              className="hp-mt-sm-16"
              type="primary"
              icon={<RiAddBoxLine size={16} className="remix-icon" />}
            >
              ADD DATA SOURCE TYPE
            </Button>
          </Link>
        </Col>
      )
    }
  }

  const btnForEditData = (dataIndex) => {
    if(pageRoles.includes(ACTION_EDIT)){
      return (
        <Link
                to={`/data-source-types/forms/edit-data/${window.btoa(dataIndex)}`}
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
                title="Are you sure to delete this data source type?"
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
  const btnForViewData = (dataIndex) => {
    if(pageRoles.includes(ACTION_VIEW)){
      return (
        <Link
              to={`/data-source-types/forms/view-data/${window.btoa(dataIndex)}`}
        >
            <RiEyeLine set="broken"  size={24}
              className="hp-cursor-pointer hp-transition hp-hover-text-color-info-1 hp-text-color-black-80"/>
        </Link>
      )
    }
  }

  const columns = [
    {
      title: "Data Source Type",
      dataIndex: "source_type",
      align: "left",
      ...getColumnSearchProps('source_type'),
      sorter: (a, b) => a.source_type.localeCompare(b.source_type),
       sortDirections: ['descend', 'ascend'],
    },
    {
      title: "Description",
      dataIndex: "source_type_desc",
      align: "left",
      ...getColumnSearchProps('source_type'),
      sorter: (a, b) => a.source_type.localeCompare(b.source_type),
       sortDirections: ['descend', 'ascend'],
    },
    {
      title: "Status",
      dataIndex: "is_active",
      align: "left",
      ...getColumnSearchProps('source_type'),
      sorter: (a, b) => a.source_type.localeCompare(b.source_type),
       sortDirections: ['descend', 'ascend'],
      render: (dataIndex) => (
      <Tag color={dataIndex ? "green" : "red"}>{dataIndex ? "Active" : "Inactive"}</Tag>
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

  const handleButtonClick = (e, record) => {
    var data = e.key.split("_");
    switch (data[0]) {
      case "View":
        // history.push(`/data-source-types/forms/view-data/${window.btoa(record.key)}`);
        viewDataDetails(record);
        break;
      case "Edit":
        history.push(`/data-source-types/forms/edit-data/${window.btoa(record.key)}`)
        break;
      case "Delete":
        showConfirm(record, "Are you sure to delete this data source type?");
        break;
      default:
        break;
    }
  } 

  const viewDataDetails = (detail) => {
   Modal.info({
     icon: (
         <RiDraftLine className="remix-icon"/>
     ),
     title: (
       <h5 className="hp-mb-0 hp-font-weight-500">View National Data Source</h5>
     ),
     width:800,
     content: (
       <ul style={{ listStyle:"none" }}>
       <li><b>Data Source Type: </b>{detail?.source_type}</li>
       <li><b>Description: </b>{detail?.source_type_desc}</li>
       <li><b>Status: </b>{detail?.is_active ? "Active" : "Inactive"}</li>
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
  const handleTableChange = (pagination, filters, sorter) => {
    fetch(pagination);
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
              breadCrumbActive="Data Source Type"
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