import { useState, useEffect, useRef  } from "react";
import { Link, useHistory } from "react-router-dom";

// Redux
import { getAllData, getAllForTblData, deletePageSetupData } from "../../../redux/page-setup/pageSetupActions";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import ReactHtmlParser, { convertNodeToElement, processNodes } from "react-html-parser";

import { Row, Col, Button, Input, Table, Card, Tag, Space, Popconfirm, notification, Dropdown, Menu, Modal } from "antd";
import Highlighter from 'react-highlight-words';
import { SearchOutlined, DownOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Search, Delete, EditSquare } from "react-iconly";
import { RiAddBoxLine, RiErrorWarningLine, RiEyeLine, RiDraftLine } from "react-icons/ri";
import BreadCrumbs from '../../../layout/components/content/breadcrumbs';
import {ACTION_VIEW, ACTION_EDIT, ACTION_DELETE, ACTION_ADD} from '../../../utils/LangConstants';
import {successMsg, errorMsg, warningMsg, infoMsg, callNotif} from '../../../utils/global-functions/minor-functions';
export default function TableList(props) {
  const { pageRoles } = props;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false)
  const [listParams, setListParams] = useState(false)
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  })
  const {confirm} = Modal;
  const [sorter, setSorter] = useState({})
  const [filters, setFilters] = useState({})
  const [data, setData] = useState([])
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const history = useHistory();

  // Redux
  const dispatch = useDispatch();
  const {page_data, page_links, page_meta, page_details, status, message} = useSelector((state) => state.pages);
  // Sidebar
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const handleFilter = (val) => {
    setSearchTerm(val);
    fetch(pagination, filters, sorter, val);
  };

  // Get Data 
  useEffect(() => {
    fetch(pagination);
  }, []);

  const processData = () => {
    const results = [];
    if(typeof page_data !== 'undefined'){
      console.log(page_data);
      for (let i = 0; i < page_data.length; i++) {
        results.push({
          key: page_data[i].id,
          title: page_data[i]?.attributes?.title,
          summary: page_data[i]?.attributes?.summary,
          body: page_data[i]?.attributes?.body,
          status: page_data[i]?.attributes?.status,
          content_type_id: page_data[i]?.attributes?.content_type_id,
          last_modified: moment(page_data[i]?.attributes?.updated_at).format('LLL'),
          actions: availableActions()

        });
      }
      setData(results);
      if(Object.keys(page_meta).length){
        setPagination({
          ...listParams.pagination,
          total: page_meta.pagination.total, // total regardless of pagination
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
    if(pageRoles.includes(ACTION_DELETE)){
      dispatch(deletePageSetupData({}, id))
      .then(()=> {
        callNotif("Success", "Page setup data is deleted successfully.", "success")
        fetch(pagination);
      });
    }else{
      callNotif("Information", `Oops! can't execute, you don't have ${ACTION_DELETE} permission.`, 'info')
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

  const handleButtonClick = (e, record) => {
    var data = e.key.split("_");
    switch (data[0]) {
      case "View":
        viewDataDetails(record);
        break;
      case "Edit":
        history.push(`/pages-setup/forms/edit-data/${window.btoa(record.key)}`)
        break;
      case "Delete":
        showConfirm(record, "Are you sure you want to delete this Page?");
        break;
      default:
        break;
    }
  }

  const options = {
    decodeEntities: true,
  };

  const viewDataDetails = (detail) => {
   Modal.info({
     icon: (
         <RiDraftLine className="remix-icon"/>
     ),
     title: (
       <h5 className="hp-mb-0 hp-font-weight-500">View Page</h5>
     ),
     width:800,
     content: (
       <ul style={{ listStyle:"none" }}>
        <li><b>Title: </b>{detail?.title}</li>
        <li><b>Summary: </b>{ReactHtmlParser(detail?.summary)}</li>
        <li><b>Body: </b>{ReactHtmlParser(detail?.body,options)}</li>
        <li><b>Status: </b>{(detail?.status).charAt(0).toUpperCase() + detail?.status.slice(1)}</li>
        <li><b>Content Type: </b> {detail?.content_type_id == 1 ? "Home Page" : detail?.content_type_id == 2 ? "AFNS Report" : detail?.content_type_id == 3 ? "About Us" : "Contact Us"}</li>

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

  const btnForAddData = () => {
    if(pageRoles.includes(ACTION_ADD)){
      return (
        <Col className="gutter-row" span={7}>
          <Link to={`/pages-setup/forms/add-data/${window.btoa(0)}`}>
                  <Button
                    block
                    className="hp-mt-sm-16"
                    type="primary"
                    icon={<RiAddBoxLine size={16} className="remix-icon" />}
                  >
                    ADD PAGE SETUP
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
                   to={`/pages-setup/forms/edit-data/${window.btoa(dataIndex)}`}
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
          title="Are you sure to delete this page setup?"
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
                   to={`/pages-setup/forms/view-data/${window.btoa(dataIndex)}`}
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
      align: "left",
      sorter: true
    },
    {
      title: "Last Modified",
      dataIndex: "last_modified",
    },
    {
      title: "Status",
      dataIndex: "status",
      width: "15%",
      align: "center",
      sorter: true,

      render: (dataIndex) => (
        <Tag color={dataIndex == "draft" ? "blue" : "green"}>{(dataIndex).toUpperCase()}</Tag>
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
              breadCrumbParent="Website"
              breadCrumbActive="Page Setup"
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