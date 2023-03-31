import { useState, useEffect, useRef  } from "react";
import { Link, useHistory } from "react-router-dom";
import moment from "moment";
// Redux
import { getAllData, getAllForTblData, deleteDataSourceData } from "../../../redux/dataSources/dataSourcesActions";
import { useDispatch, useSelector } from "react-redux";

import { Row, Col, Button, Input, Table, Card, Tag, Space, Popconfirm, notification, Modal, Dropdown, Menu } from "antd";
import Highlighter from 'react-highlight-words';
import { SearchOutlined, DownOutlined, ExclamationCircleOutlined  } from '@ant-design/icons';
import { Search, Delete, EditSquare } from "react-iconly";
import { RiAddBoxLine, RiErrorWarningLine, RiEyeLine, RiDraftLine, } from "react-icons/ri";

// import { columns } from "./Columns";
// import AddNewAms from "./Modal";
import BreadCrumbs from '../../../layout/components/content/breadcrumbs';
import {ACTION_VIEW, ACTION_EDIT, ACTION_DELETE, ACTION_ADD, DELETED_DATA} from '../../../utils/LangConstants';
import {callNotif} from '../../../utils/global-functions/minor-functions';
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
  const {dataSource_data, dataSource_links, dataSource_meta, dataSource_details, status, message} = useSelector((state) => state.dataSources);
  const { myprofile: {roles, organization} } = useSelector((state) => state.users);
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
    fetch(pagination);
  }, []);

  useEffect(() => {
    errMsg();
  }, [status]);

  const clearErrMessage = () => {
    dispatch({
        type: 'SET_SOURCE_DATA_MESSAGE',
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

  const processData = () => {
    const results = [];
    if(typeof dataSource_data !== 'undefined'){
      for (let i = 0; i < dataSource_data.length; i++) {
        results.push({
          key: dataSource_data[i].id,
          datasource_type: dataSource_data[i]?.attributes?.datasource_type?.name,
          custodian: dataSource_data[i]?.attributes?.custodian?.name,
          title: dataSource_data[i]?.attributes?.title,
          publication_date: dataSource_data[i]?.attributes?.publication_date ?? "N/A",
          other_details: dataSource_data[i]?.attributes,
          actions: availableActions()
        });
      }
      console.log(results);
      setData(results);
      if(Object.keys(dataSource_meta).length){
        setPagination({
          ...listParams.pagination,
          total: dataSource_meta.pagination.total, // total regardless of pagination
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

  const confirmDel = (id) => {
    console.log(id);
    if(pageRoles.includes(ACTION_DELETE)){
      dispatch(deleteDataSourceData({}, id))
      .then(()=> {
        openNotificationWithIcon("success", "Success", `International Data Source ${DELETED_DATA}`)
        fetch(pagination);
      }).catch((e) => {
        errMsg();
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

  const btnForAddData = () => {
    if(pageRoles.includes(ACTION_ADD)){
      return (
        <Col className="gutter-row" span={7}>
        <Link to={`/international-data-sources/forms/add-data/${window.btoa(0)}`}>
                  <Button
                    block
                    className="hp-mt-sm-16"
                    type="primary"
                    icon={<RiAddBoxLine size={16} className="remix-icon" />}
                  >
                    ADD INTERNATIONAL DATA SOURCE
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
                   to={`/international-data-sources/forms/edit-data/${window.btoa(dataIndex)}`}
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
                title="Are you sure to delete this intenational data source?"
                onConfirm={() => confirmDel(dataIndex)}
                okText="Yes"
                cancelText="No"
            >
                <Delete
                    size={24}
                    className="hp-cursor-pointer hp-transition hp-hover-text-color-danger-1 hp-text-color-black-80"
                />
            </Popconfirm>
      )
    }
  }


  const viewDataDetails = (detail) => {
    console.log('dataIndex', detail);
    Modal.info({
      icon: (
          <RiDraftLine className="remix-icon"/>
      ),
      title: (
        <h5 className="hp-mb-0 hp-font-weight-500">View International Datasource Details</h5>
      ),
      width:800,
      content: (
        <ul style={{ listStyle:"none" }}>
              <li><b>Source Type: </b>{detail?.datasource_type}</li>
              <li><b>Custodian: </b>{detail?.custodian}</li>
              <li><b>Title: </b>{detail?.title}</li>
              <li><b>Publication / Coverage Date: </b>{detail?.publication_date}</li>
              {detail?.other_details?.url ? (<li><b>Link: </b>{detail?.other_details?.url}</li>): ""}
                  {
                    detail?.other_details?.document_url ? (
                      <>
                        <li>
                          <b>Document: </b>
                            <Button size="small"  onClick={() => window.open(detail?.other_details?.document_url, '_blank')}>View Document</Button>
                        </li>
                        <li><b>Language: </b>{detail?.other_details?.language}</li>
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

  const btnForViewData = (dataIndex) => {
    
    if(pageRoles.includes(ACTION_VIEW)){
      return (
              <a
                   onClick={() => viewDataDetails(dataIndex)}
              >
                  <RiEyeLine set="broken"  size={24}
                    className="hp-cursor-pointer hp-transition hp-hover-text-color-info-1 hp-text-color-black-80"/>
              </a>
      )
    }
  }

  const columns = [
    {
      title: "Source Type",
      dataIndex: "datasource_type",
      align: "left",
      sorter: true,
      // ...getColumnSearchProps('datasource_type'),
      // sorter: (a, b) => a.datasource_type.localeCompare(b.datasource_type),
      //  sortDirections: ['descend', 'ascend'],
    },
    {
      title: "Custodian",
      dataIndex: "custodian",
      align: "left",
      sorter: true,
      // ...getColumnSearchProps('custodian'),
      // sorter: (a, b) => a.custodian.localeCompare(b.custodian),
      //  sortDirections: ['descend', 'ascend'],
    },
    {
      title: "Title",
      dataIndex: "title",
      align: "left",
      sorter: true,
      // ...getColumnSearchProps('title'),
      // sorter: (a, b) => a.title.localeCompare(b.title),
      //  sortDirections: ['descend', 'ascend'],
    },
    {
      title: "Publication/Coverage",
      dataIndex: "publication_date",
      align: "left",
      sorter: true,
      // ...getColumnSearchProps('publication_date'),
      // sorter: (a, b) => a.publication_date.localeCompare(b.publication_date),
      //  sortDirections: ['descend', 'ascend'],
    },
    // {
    //   title: "Actions",
    //   dataIndex: "key",
    //   width: "15%",
    //   align: "center",
    //   render: (_, dataIndex) => (
    //       <Space>
    //           {btnForViewData(dataIndex)}
    //           {btnForEditData(dataIndex?.key)}
    //           {btnForDeleteData(dataIndex?.key)}
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

  const showConfirm = (record, message) => {
    confirm({
      title: message,
      icon:(
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
        // history.push(`/international-data-sources/forms/view-data/${window.btoa(record.key)}`);
        viewDataDetails(record);
        break;
      case "Edit":
        history.push(`/international-data-sources/forms/edit-data/${window.btoa(record.key)}`)
        break;
      case "Delete":
        showConfirm(record, "Are you sure you want to delete this international data source?");
        break;
      default:
        break;
    }
  } 


  const handleTableChange = (pagination, filters, sorter) => {
    setSorter(sorter);
    setFilters(filters);
    fetch(pagination, filters, sorter, searchTerm);
  };

  const fetch = (params = {}, filters={},  sorter={}, search_key="") => {
    setLoading(true);
    const dataParams = {
      limit: params.pageSize,
      page: params.current,
      intl_flag:true
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
              breadCrumbActive="International Data Source"
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