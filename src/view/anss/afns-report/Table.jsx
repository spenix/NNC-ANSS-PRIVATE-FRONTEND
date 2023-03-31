import { useState, useEffect, useRef  } from "react";
import { Link, useHistory } from "react-router-dom";
// Redux
import { getAllData, getAllForTblData, deleteAfnsReportData } from "../../../redux/afns-report/afnsReportActions";
import { useDispatch, useSelector } from "react-redux";

import { Row, Col, Button, Input, Table, Card, Tag, Space, Popconfirm, notification, Dropdown, Menu, Modal } from "antd";
import Highlighter from 'react-highlight-words';
import { SearchOutlined, DownOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Search, Delete, EditSquare } from "react-iconly";
import { RiAddBoxLine, RiErrorWarningLine, RiEyeLine,RiDraftLine  } from "react-icons/ri";

// import { columns } from "./Columns";
// import AddNewAms from "./Modal";
import BreadCrumbs from '../../../layout/components/content/breadcrumbs';
import {callNotif, createFile} from '../../../utils/global-functions/minor-functions';
import {ACTION_VIEW, ACTION_EDIT, ACTION_DELETE, ACTION_ADD, DELETED_DATA} from '../../../utils/LangConstants';

export default function TableList(props) {
  const { pageRoles } = props;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false)
  const [listParams, setListParams] = useState(false)
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  })
  const [sorter, setSorter] = useState({})
  const [filters, setFilters] = useState({})
  const [data, setData] = useState([])
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const {confirm} = Modal;
  const history = useHistory();
  const searchInput = useRef(null);
  // Redux
  const dispatch = useDispatch();
  const {afnsReport_data, afnsReport_links, afnsReport_meta, afnsReport_details, status, message} = useSelector((state) => state.afnsReport);
  // Sidebar
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const handleFilter = (val) => {
    setSearchTerm(val);
    fetch(pagination, filters, sorter, val);
  };
  const openNotificationWithIcon = (type, title = "", msg = "") => {
    callNotif(title, msg, type);
  };

  // Get Data 
  useEffect(() => {
    fetch();
  }, []);

  const processData = () => {
    const results = [];
    if(typeof afnsReport_data !== 'undefined'){
      console.log('afnsReport_data', afnsReport_data);
      for (let i = 0; i < afnsReport_data.length; i++) {
        results.push({
          key: afnsReport_data[i].id,
          title: afnsReport_data[i]?.attributes?.title,
          year: afnsReport_data[i]?.attributes?.year,
          file_url: afnsReport_data[i]?.attributes?.file,
          status: afnsReport_data[i]?.attributes?.status,
          actions: availableActions()
        });
      }
      setData(results);
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
    dispatch(deleteAfnsReportData({}, id))
    .then(()=> {
      openNotificationWithIcon("success", "Success", "AFNS Report data is deleted successfully.")
      fetch();
    });
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


  const btnForEditData = (dataIndex) => {
    if(pageRoles.includes(ACTION_EDIT)){
      return (
        <Link
                   to={`/afns-report/forms/edit-data/${window.btoa(dataIndex)}`}
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
                title="Are you sure you want to delete this AFNS report?"
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
                   to={`/afns-report/forms/view-data/${window.btoa(dataIndex)}`}
              >
                  <RiEyeLine set="broken"  size={24}
                    className="hp-cursor-pointer hp-transition hp-hover-text-color-info-1 hp-text-color-black-80"/>
              </Link>
      )
    }
  }


  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      width: "35%",
      align: "left",
      sorter: true
      // ...getColumnSearchProps('title'),
      // sorter: (a, b) => a.title.localeCompare(b.title),
      //  sortDirections: ['descend', 'ascend'],
    },
    {
      title: "Year",
      dataIndex: "year",
      align: "left",
      sorter: true
      // ...getColumnSearchProps('year'),
      // sorter: (a, b) => a.year - b.year,
      //  sortDirections: ['descend', 'ascend'],
    },
    {
      title: "File",
      dataIndex: "file_url",
      width: "15%",
      align: "left",
       render: (dataIndex) => (
         <Button size="small" onClick={() => {window.open(dataIndex, '_blank')}}>Download</Button>
       )
    },
    // {
    //   title: "Status",
    //   dataIndex: "status",
    //   width: "5%",
    //   align: "center",
    //   sorter: (a, b) => a.status.length - b.status.length,
    //   sortDirections: ['descend', 'ascend'],
    //   // render: (dataIndex) => (
    //   //   <Tag color={dataIndex ? "green" : "red"}>{dataIndex ? "Active" : "Inactive"}</Tag>
    //   // )
    // },
    // {
    //   title: "Actions",
    //   dataIndex: "key",
    //   width: "15%",
    //   align: "center",
    //   render: (dataIndex) => (
    //     <Space>
    //           {btnForViewData(dataIndex)}
    //           {btnForEditData(dataIndex)}
    //           {btnForDeleteData(dataIndex)}
    //       </Space>
    //     ),
    // },
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
        // history.push(`/afns-report/forms/view-data/${window.btoa(record.key)}`);
        viewDataDetails(record);
        break;
      case "Edit":
        history.push(`/afns-report/forms/edit-data/${window.btoa(record.key)}`)
        break;
      case "Delete":
        showConfirm(record, "Are you sure you want to delete this AFNS report?");
        break;
      default:
        break;
    }
  } 
  const viewDataDetails = (detail) => {
    console.log(detail)
    Modal.info({
      icon: (
          <RiDraftLine className="remix-icon"/>
      ),
      title: (
        <h5 className="hp-mb-0 hp-font-weight-500">View AFNS Report</h5>
      ),
      width:800,
      content: (
        <ul style={{ listStyle:"none" }}>
        <li><b>Title: </b>{detail?.title}</li>
        <li><b>Year: </b>{detail?.year}</li>
     
            {
              detail?.file_url ? (
                <>
                  <li>
                    <b>File: </b>
                      <Button size="small"  onClick={() => window.open(detail?.file_url, '_blank')}>Download</Button>
                  </li>
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
  const showConfirm = (record, message) => {
    confirm({
      title: message,
      icon: <span className="remix-icon">
              <ExclamationCircleOutlined />
            </span>,
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

  const btnForAddData = () => {
    if(pageRoles.includes(ACTION_ADD)){
      return (
        <Col className="gutter-row" span={7}>
                <Link to={`/afns-report/forms/add-data/${window.btoa(0)}`}>
                  <Button
                    block
                    className="hp-mt-sm-16"
                    type="primary"
                    icon={<RiAddBoxLine size={16} className="remix-icon" />}
                  >
                    ADD AFNS REPORT
                  </Button>
                </Link>
        </Col>
      )
    }
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
              breadCrumbActive="AFNS Report"
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